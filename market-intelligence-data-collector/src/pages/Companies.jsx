import React, { useState } from 'react';
import { Building2, ExternalLink } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { CompaniesDB } from '../lib/db';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../lib/i18n';

const INDUSTRIES = [
  '', 'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
  'Manufacturing', 'Consulting', 'Media', 'Energy', 'Real Estate',
  'Logistics', 'Government', 'Non-profit', 'Telecommunications', 'Other',
];

const EMPTY_FORM = {
  name: '', industry: '', website: '', description: '',
  services: '', location: '', notes: '', source_url: '', raw_text: '',
};

export default function Companies() {
  const { language, showToast } = useApp();
  const { t } = useTranslation(language);
  const f = t.companies.fields;

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'name', label: f.name },
    {
      key: 'industry', label: f.industry,
      render: (v) => v ? <Badge variant="info">{v}</Badge> : <span className="text-[#4F5459] italic">—</span>
    },
    {
      key: 'website', label: f.website,
      render: (v) => v ? (
        <a href={v} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#BFACA4] hover:text-white transition-colors truncate max-w-[150px]"
          onClick={e => e.stopPropagation()}>
          <ExternalLink size={11} />
          {v.replace(/^https?:\/\//, '')}
        </a>
      ) : <span className="text-[#4F5459] italic">—</span>
    },
    { key: 'location', label: f.location },
    { key: 'services', label: f.services },
    { key: 'notes', label: f.notes },
  ];

  const filterFields = [
    { key: 'industry', label: f.industry },
    { key: 'location', label: f.location },
  ];

  const openAdd = () => { setForm(EMPTY_FORM); setEditRecord(null); setErrors({}); setModalOpen(true); };
  const openEdit = (row) => { setForm({ ...EMPTY_FORM, ...row }); setEditRecord(row); setErrors({}); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Company name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const result = editRecord
      ? await CompaniesDB.update(editRecord.id, form)
      : await CompaniesDB.insert(form);
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
          db={CompaniesDB}
          columns={columns}
          title={t.companies.title}
          subtitle={t.companies.subtitle}
          onAdd={openAdd}
          onEdit={openEdit}
          filterFields={filterFields}
          rowPrimaryField="name"
          emptyIcon={<Building2 size={20} />}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editRecord ? `${t.actions.edit} – ${editRecord.name || ''}` : t.actions.add}
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={closeModal}>{t.actions.cancel}</Button>
            <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>{t.actions.save}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label={f.name} value={form.name} onChange={set('name')} placeholder="e.g. McKinsey & Company" error={errors.name} />
          <Select label={f.industry} value={form.industry} onChange={set('industry')}>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i || '— Select industry —'}</option>)}
          </Select>
          <Input label={f.website} value={form.website} onChange={set('website')} placeholder="https://..." />
          <Input label={f.location} value={form.location} onChange={set('location')} placeholder="e.g. Dubai, UAE" />
          <div className="md:col-span-2">
            <Textarea label={f.description} value={form.description} onChange={set('description')} rows={3} placeholder="Company overview and background..." />
          </div>
          <div className="md:col-span-2">
            <Textarea label={f.services} value={form.services} onChange={set('services')} rows={3} placeholder="List of services, products, or offerings..." />
          </div>
          <div className="md:col-span-2">
            <Textarea label={f.notes} value={form.notes} onChange={set('notes')} rows={2} placeholder="Internal research notes..." />
          </div>
          <Input label={f.sourceUrl} value={form.source_url} onChange={set('source_url')} placeholder="https://..." />
          <div className="md:col-span-2">
            <Textarea label={f.rawText} value={form.raw_text} onChange={set('raw_text')} rows={4} placeholder="Raw scraped text from source..." helper="Original unprocessed content" />
          </div>
        </div>
      </Modal>
    </>
  );
}
