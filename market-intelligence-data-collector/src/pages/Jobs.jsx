import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { JobsDB } from '../lib/db';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../lib/i18n';

const INDUSTRIES = [
  '', 'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
  'Manufacturing', 'Consulting', 'Media', 'Energy', 'Real Estate',
  'Logistics', 'Government', 'Non-profit', 'Other',
];

const SOURCES = [
  '', 'LinkedIn', 'Indeed', 'Glassdoor', 'Bayt', 'Naukri',
  'Company Website', 'Recruitment Agency', 'Referral', 'Other',
];

const EMPTY_FORM = {
  title: '', company: '', industry: '', location: '', salary: '',
  description: '', responsibilities: '', requirements: '',
  source: '', date_collected: new Date().toISOString().slice(0, 10),
  original_url: '', raw_text: '',
};

export default function Jobs() {
  const { language, showToast } = useApp();
  const { t } = useTranslation(language);
  const f = t.jobs.fields;

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'title', label: f.title },
    { key: 'company', label: f.company },
    {
      key: 'industry', label: f.industry,
      render: (v) => v ? <Badge variant="info">{v}</Badge> : <span className="text-[#4F5459] italic">—</span>
    },
    { key: 'location', label: f.location },
    { key: 'salary', label: f.salary },
    {
      key: 'source', label: f.source,
      render: (v) => v ? <Badge variant="muted">{v}</Badge> : <span className="text-[#4F5459] italic">—</span>
    },
    { key: 'date_collected', label: f.dateCollected, render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  const filterFields = [
    { key: 'company', label: f.company },
    { key: 'industry', label: f.industry },
    { key: 'location', label: f.location },
    { key: 'source', label: f.source },
  ];

  const openAdd = () => { setForm(EMPTY_FORM); setEditRecord(null); setErrors({}); setModalOpen(true); };
  const openEdit = (row) => { setForm({ ...EMPTY_FORM, ...row }); setEditRecord(row); setErrors({}); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Job title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form };
    const result = editRecord
      ? await JobsDB.update(editRecord.id, payload)
      : await JobsDB.insert(payload);
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
          db={JobsDB}
          columns={columns}
          title={t.jobs.title}
          subtitle={t.jobs.subtitle}
          onAdd={openAdd}
          onEdit={openEdit}
          filterFields={filterFields}
          rowPrimaryField="title"
          emptyIcon={<Briefcase size={20} />}
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
          <Input label={f.title} value={form.title} onChange={set('title')} placeholder="e.g. Senior Data Analyst" error={errors.title} />
          <Input label={f.company} value={form.company} onChange={set('company')} placeholder="e.g. Accenture" />
          <Select label={f.industry} value={form.industry} onChange={set('industry')}>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i || '— Select industry —'}</option>)}
          </Select>
          <Input label={f.location} value={form.location} onChange={set('location')} placeholder="e.g. Riyadh, Saudi Arabia" />
          <Input label={f.salary} value={form.salary} onChange={set('salary')} placeholder="e.g. SAR 15,000 – 25,000 / month" />
          <Select label={f.source} value={form.source} onChange={set('source')}>
            {SOURCES.map(s => <option key={s} value={s}>{s || '— Select source —'}</option>)}
          </Select>
          <Input type="date" label={f.dateCollected} value={form.date_collected} onChange={set('date_collected')} />
          <Input label={f.originalUrl} value={form.original_url} onChange={set('original_url')} placeholder="https://..." />
          <div className="md:col-span-2">
            <Textarea label={f.description} value={form.description} onChange={set('description')} rows={4} placeholder="Full job description..." />
          </div>
          <div className="md:col-span-2">
            <Textarea label={f.responsibilities} value={form.responsibilities} onChange={set('responsibilities')} rows={3} placeholder="Key responsibilities and duties..." />
          </div>
          <div className="md:col-span-2">
            <Textarea label={f.requirements} value={form.requirements} onChange={set('requirements')} rows={3} placeholder="Required qualifications and skills..." />
          </div>
          <div className="md:col-span-2">
            <Textarea label={f.rawText} value={form.raw_text} onChange={set('raw_text')} rows={4} placeholder="Paste original scraped text here..." helper="Store the raw, unprocessed text for future reference" />
          </div>
        </div>
      </Modal>
    </>
  );
}
