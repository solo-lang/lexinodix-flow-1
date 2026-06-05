import React, { useState } from 'react';
import { BookOpen, Tag, X, Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { NotesDB } from '../lib/db';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../lib/i18n';

const CATEGORIES = [
  '', 'Market Trend', 'Competitive Intelligence', 'Industry Analysis',
  'Consumer Behavior', 'Technology', 'Regulatory', 'Financial',
  'Talent & Workforce', 'Geographic', 'Other',
];

const EMPTY_FORM = {
  title: '', category: '',
  observation: '', tags: [],
  date: new Date().toISOString().slice(0, 10),
  raw_text: '',
};

function TagsInput({ tags = [], onChange }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
      setInput('');
    }
  };

  const removeTag = (tag) => onChange(tags.filter(t => t !== tag));

  return (
    <div>
      <label className="text-xs font-semibold text-[#BFACA4] uppercase tracking-wider">Tags</label>
      <div className="mt-1.5 flex flex-wrap gap-1.5 p-2 min-h-[42px] bg-[#011C26]/60 border border-[#072A40]/60 rounded-lg">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#072A40] border border-[#BFACA4]/20 text-[#D9C5C1] text-xs">
            <Tag size={10} />
            {tag}
            <button onClick={() => removeTag(tag)} className="text-[#4F5459] hover:text-white ml-0.5">
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
          placeholder="Add tag, press Enter..."
          className="flex-1 min-w-[100px] bg-transparent text-xs text-white placeholder-[#4F5459] focus:outline-none"
        />
      </div>
      <p className="text-[10px] text-[#4F5459] mt-1">Press Enter or comma to add a tag</p>
    </div>
  );
}

export default function ResearchNotes() {
  const { language, showToast } = useApp();
  const { t } = useTranslation(language);
  const f = t.notes.fields;

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'title', label: f.title },
    {
      key: 'category', label: f.category,
      render: (v) => v ? <Badge variant="accent">{v}</Badge> : <span className="text-[#4F5459] italic">—</span>
    },
    { key: 'observation', label: f.observation },
    {
      key: 'tags', label: f.tags,
      render: (v) => {
        const tags = Array.isArray(v) ? v : (typeof v === 'string' ? v.split(',').filter(Boolean) : []);
        return tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map(tag => <Badge key={tag} variant="muted" className="text-[9px]">{tag}</Badge>)}
            {tags.length > 3 && <Badge variant="muted" className="text-[9px]">+{tags.length - 3}</Badge>}
          </div>
        ) : <span className="text-[#4F5459] italic">—</span>;
      }
    },
    { key: 'date', label: f.date, render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  const filterFields = [
    { key: 'category', label: f.category },
  ];

  const openAdd = () => { setForm(EMPTY_FORM); setEditRecord(null); setErrors({}); setModalOpen(true); };
  const openEdit = (row) => {
    const tags = Array.isArray(row.tags) ? row.tags :
      (typeof row.tags === 'string' ? row.tags.replace(/[{}"]/g, '').split(',').filter(Boolean) : []);
    setForm({ ...EMPTY_FORM, ...row, tags });
    setEditRecord(row);
    setErrors({});
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form };
    const result = editRecord
      ? await NotesDB.update(editRecord.id, payload)
      : await NotesDB.insert(payload);
    setSaving(false);
    if (result.error) { showToast(result.error.message || t.status.error, 'error'); return; }
    showToast(t.status.success);
    setModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <div className="flex-1 overflow-hidden flex flex-col h-full" key={refreshKey}>
        <DataTable
          db={NotesDB}
          columns={columns}
          title={t.notes.title}
          subtitle={t.notes.subtitle}
          onAdd={openAdd}
          onEdit={openEdit}
          filterFields={filterFields}
          rowPrimaryField="title"
          emptyIcon={<BookOpen size={20} />}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editRecord ? `${t.actions.edit} – ${editRecord.title || ''}` : t.actions.add}
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={closeModal}>{t.actions.cancel}</Button>
            <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>{t.actions.save}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Input label={f.title} value={form.title} onChange={set('title')} placeholder="Observation title or key insight..." error={errors.title} />
          </div>
          <Select label={f.category} value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c || '— Select category —'}</option>)}
          </Select>
          <Input type="date" label={f.date} value={form.date} onChange={set('date')} />
          <div className="md:col-span-2">
            <Textarea label={f.observation} value={form.observation} onChange={set('observation')} rows={6} placeholder="Detailed observation, finding, or research note..." />
          </div>
          <div className="md:col-span-2">
            <TagsInput
              tags={form.tags}
              onChange={(tags) => setForm(f => ({ ...f, tags }))}
            />
          </div>
          <div className="md:col-span-2">
            <Textarea label={f.rawText} value={form.raw_text} onChange={set('raw_text')} rows={3} placeholder="Supporting raw text or quotes..." helper="Original source material" />
          </div>
        </div>
      </Modal>
    </>
  );
}
