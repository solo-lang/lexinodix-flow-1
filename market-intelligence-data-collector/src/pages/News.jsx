import React, { useState } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { NewsDB } from '../lib/db';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../lib/i18n';

const INDUSTRIES = [
  '', 'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
  'Manufacturing', 'Consulting', 'Media', 'Energy', 'Real Estate',
  'Logistics', 'Government', 'General', 'Other',
];

const EMPTY_FORM = {
  headline: '', source: '', date: new Date().toISOString().slice(0, 10),
  summary: '', full_content: '', url: '', industry: '', raw_text: '',
};

export default function News() {
  const { language, showToast } = useApp();
  const { t } = useTranslation(language);
  const f = t.news.fields;

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'headline', label: f.headline },
    {
      key: 'source', label: f.source,
      render: (v) => v ? <Badge variant="muted">{v}</Badge> : <span className="text-[#4F5459] italic">—</span>
    },
    { key: 'date', label: f.date, render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    {
      key: 'industry', label: f.industry,
      render: (v) => v ? <Badge variant="info">{v}</Badge> : <span className="text-[#4F5459] italic">—</span>
    },
    { key: 'summary', label: f.summary },
    {
      key: 'url', label: f.url,
      render: (v) => v ? (
        <a href={v} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#BFACA4] hover:text-white transition-colors"
          onClick={e => e.stopPropagation()}>
          <ExternalLink size={11} />Link
        </a>
      ) : <span className="text-[#4F5459] italic">—</span>
    },
  ];

  const filterFields = [
    { key: 'source', label: f.source },
    { key: 'industry', label: f.industry },
  ];

  const openAdd = () => { setForm(EMPTY_FORM); setEditRecord(null); setErrors({}); setModalOpen(true); };
  const openEdit = (row) => { setForm({ ...EMPTY_FORM, ...row }); setEditRecord(row); setErrors({}); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const validate = () => {
    const e = {};
    if (!form.headline.trim()) e.headline = 'Headline is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const result = editRecord
      ? await NewsDB.update(editRecord.id, form)
      : await NewsDB.insert(form);
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
          db={NewsDB}
          columns={columns}
          title={t.news.title}
          subtitle={t.news.subtitle}
          onAdd={openAdd}
          onEdit={openEdit}
          filterFields={filterFields}
          rowPrimaryField="headline"
          emptyIcon={<Newspaper size={20} />}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editRecord ? `${t.actions.edit} – ${editRecord.headline?.slice(0, 40) || ''}...` : t.actions.add}
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
            <Input label={f.headline} value={form.headline} onChange={set('headline')} placeholder="Full article headline..." error={errors.headline} />
          </div>
          <Input label={f.source} value={form.source} onChange={set('source')} placeholder="e.g. Bloomberg, Reuters, Arab News" />
          <Input type="date" label={f.date} value={form.date} onChange={set('date')} />
          <Select label={f.industry} value={form.industry} onChange={set('industry')}>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i || '— Select industry —'}</option>)}
          </Select>
          <Input label={f.url} value={form.url} onChange={set('url')} placeholder="https://..." />
          <div className="md:col-span-2">
            <Textarea label={f.summary} value={form.summary} onChange={set('summary')} rows={3} placeholder="Brief summary of the article..." />
          </div>
          <div className="md:col-span-2">
            <Textarea label={f.fullContent} value={form.full_content} onChange={set('full_content')} rows={6} placeholder="Full article content..." />
          </div>
          <div className="md:col-span-2">
            <Textarea label={f.rawText} value={form.raw_text} onChange={set('raw_text')} rows={3} placeholder="Raw scraped text..." helper="Original unprocessed content from source" />
          </div>
        </div>
      </Modal>
    </>
  );
}
