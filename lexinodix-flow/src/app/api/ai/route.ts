import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAIProvider, buildWorkspaceSystemPrompt } from '@/lib/ai/providers';
import type { AIMessage, ApiResponse, AIResponse } from '@/types';
import { z } from 'zod';

const ChatSchema = z.object({
  action: z.literal('chat'),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().max(10000),
  })).max(50),
  context: z.object({
    files: z.array(z.string().uuid()).max(10).optional(),
    notes: z.array(z.string().uuid()).max(10).optional(),
  }).optional(),
  conversationId: z.string().uuid().optional(),
});

const SummarizeSchema = z.object({
  action: z.literal('summarize'),
  content: z.string().max(50000),
});

const RequestSchema = z.discriminatedUnion('action', [ChatSchema, SummarizeSchema]);

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<AIResponse>>> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 });
    }

    const data = parsed.data;
    const provider = getAIProvider();

    if (data.action === 'summarize') {
      const summary = await provider.summarize(data.content);
      return NextResponse.json({ success: true, data: { content: summary, provider: provider.name } });
    }

    let filesContent: string[] = [];
    let notesContent: string[] = [];
    let userName: string | undefined;

    // Now that client has no Database generic, these queries resolve correctly
    try {
      const profileResult = await supabase.from('profiles').select('full_name').eq('id', user.id).limit(1);
      const row = profileResult?.data?.[0] as { full_name?: string | null } | undefined;
      userName = row?.full_name ?? undefined;
    } catch { /* non-fatal */ }

    if (data.context?.notes?.length) {
      const notesResult = await supabase.from('notes').select('title, content_text').in('id', data.context.notes).eq('user_id', user.id);
      const notes = notesResult?.data as { title: string; content_text: string | null }[] | null;
      notesContent = notes?.map(n => `${n.title}\n${n.content_text ?? ''}`) ?? [];
    }

    if (data.context?.files?.length) {
      const filesResult = await supabase.from('files').select('original_name, file_type').in('id', data.context.files).eq('user_id', user.id);
      const files = filesResult?.data as { original_name: string; file_type: string }[] | null;
      filesContent = files?.map(f => `File: ${f.original_name} (${f.file_type})`) ?? [];
    }

    const systemPrompt = buildWorkspaceSystemPrompt({ filesContent, notesContent, userName });
    const result = await provider.chat(data.messages as AIMessage[], systemPrompt);

    // Persist conversation — non-fatal
    try {
      const allMessages: AIMessage[] = [...data.messages, { role: 'assistant', content: result.content }];
      if (data.conversationId) {
        await supabase.from('ai_conversations').update({ messages: allMessages as any, updated_at: new Date().toISOString() }).eq('id', data.conversationId).eq('user_id', user.id);
      } else {
        const title = data.messages.find(m => m.role === 'user')?.content?.slice(0, 80) ?? 'New Conversation';
        await supabase.from('ai_conversations').insert({ user_id: user.id, title, messages: allMessages as any, context_files: (data.context?.files ?? []) as any, context_notes: (data.context?.notes ?? []) as any });
      }
    } catch (e) {
      console.error('[AI Route] Persist failed:', e);
    }

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('[AI Route] Error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
