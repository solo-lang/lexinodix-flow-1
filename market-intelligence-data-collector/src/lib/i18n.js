/**
 * Lexinodix Intelligence Engine
 * Internationalization – Arabic / English
 */

export const translations = {
  en: {
    // App
    appName: 'Lexinodix Intelligence Engine',
    moduleName: 'Market Collector',
    tagline: 'Professional Market Intelligence Data Collection',

    // Navigation
    nav: {
      overview: 'Overview',
      jobs: 'Jobs Database',
      companies: 'Companies Database',
      news: 'News Database',
      notes: 'Research Notes',
      import: 'Import Center',
      inspection: 'Data Inspection',
      search: 'Global Search',
      schema: 'DB Schema',
      settings: 'Settings',
    },

    // Common Actions
    actions: {
      add: 'Add New',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      view: 'View Raw',
      search: 'Search',
      filter: 'Filter',
      import: 'Import',
      export: 'Export',
      clear: 'Clear',
      confirm: 'Confirm',
      close: 'Close',
      copy: 'Copy',
      copied: 'Copied!',
    },

    // Common Fields
    fields: {
      id: 'ID',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      source: 'Source',
      url: 'URL',
      notes: 'Notes',
      rawText: 'Raw Text',
      dateCollected: 'Date Collected',
      industry: 'Industry',
      location: 'Location',
    },

    // Jobs
    jobs: {
      title: 'Jobs Database',
      subtitle: 'Collect and manage job market intelligence',
      fields: {
        title: 'Job Title',
        company: 'Company',
        industry: 'Industry',
        location: 'Location',
        salary: 'Salary Range',
        description: 'Job Description',
        responsibilities: 'Responsibilities',
        requirements: 'Requirements',
        source: 'Source Platform',
        dateCollected: 'Date Collected',
        originalUrl: 'Original URL',
        rawText: 'Raw Text',
      },
    },

    // Companies
    companies: {
      title: 'Companies Database',
      subtitle: 'Build a comprehensive company intelligence registry',
      fields: {
        name: 'Company Name',
        industry: 'Industry',
        website: 'Website',
        description: 'Description',
        services: 'Services / Products',
        location: 'Location',
        notes: 'Internal Notes',
        sourceUrl: 'Source URL',
        rawText: 'Raw Text',
      },
    },

    // News
    news: {
      title: 'News Database',
      subtitle: 'Track market news and industry developments',
      fields: {
        headline: 'Headline',
        source: 'News Source',
        date: 'Publication Date',
        summary: 'Summary',
        fullContent: 'Full Content',
        url: 'Article URL',
        industry: 'Industry',
        rawText: 'Raw Text',
      },
    },

    // Research Notes
    notes: {
      title: 'Research Notes',
      subtitle: 'Document observations, insights, and research findings',
      fields: {
        title: 'Note Title',
        category: 'Category',
        observation: 'Observation',
        tags: 'Tags',
        date: 'Date',
        rawText: 'Raw Text',
      },
    },

    // Import
    import: {
      title: 'Import Center',
      subtitle: 'Import data from CSV, JSON, or manual entry',
      csv: 'CSV Import',
      json: 'JSON Import',
      manual: 'Manual Entry',
      dragDrop: 'Drag & Drop file here',
      orClick: 'or click to browse',
      selectTarget: 'Select Target Table',
      preview: 'Preview',
      importing: 'Importing...',
      success: 'Import Successful',
      records: 'records imported',
      downloadTemplate: 'Download Template',
    },

    // Inspection
    inspection: {
      title: 'Data Inspection Center',
      subtitle: 'Inspect raw data from all collection sources',
      rawData: 'Raw Data',
      structuredData: 'Structured Data',
      metadata: 'Metadata',
      originalSource: 'Original Source',
      jsonView: 'JSON View',
      tableView: 'Table View',
    },

    // Global Search
    globalSearch: {
      title: 'Global Search',
      subtitle: 'Search across all data collections',
      placeholder: 'Search jobs, companies, news, notes...',
      resultsIn: 'Results in',
      noResults: 'No results found',
      searching: 'Searching...',
    },

    // Overview
    overview: {
      title: 'Market Collection Overview',
      subtitle: 'Real-time status of collected market intelligence data',
      totalRecords: 'Total Records',
      lastUpdated: 'Last Updated',
      dataHealth: 'Data Health',
      recentActivity: 'Recent Activity',
      collectionStatus: 'Collection Status',
    },

    // Schema
    schema: {
      title: 'Database Schema',
      subtitle: 'Supabase table definitions and setup instructions',
      copySQL: 'Copy SQL',
      setupGuide: 'Setup Guide',
    },

    // Settings
    settings: {
      title: 'Settings',
      subtitle: 'Configure Lexinodix Market Collector',
      supabaseUrl: 'Supabase Project URL',
      supabaseKey: 'Supabase Anon Key',
      language: 'Interface Language',
      save: 'Save Configuration',
      localMode: 'Running in Local Mode',
      localModeDesc: 'Data is stored in browser localStorage. Connect Supabase for persistent storage.',
      connectedMode: 'Connected to Supabase',
    },

    // Status
    status: {
      loading: 'Loading...',
      saving: 'Saving...',
      deleting: 'Deleting...',
      noData: 'No records found',
      addFirst: 'Add your first record to get started',
      error: 'An error occurred',
      success: 'Operation successful',
      confirmDelete: 'Are you sure you want to delete this record? This action cannot be undone.',
    },

    // Pagination
    pagination: {
      showing: 'Showing',
      of: 'of',
      records: 'records',
      prev: 'Previous',
      next: 'Next',
      perPage: 'Per page',
    },
  },

  ar: {
    appName: 'محرك ليكسينوديكس الذكي',
    moduleName: 'جامع السوق',
    tagline: 'منصة جمع بيانات استخبارات السوق الاحترافية',

    nav: {
      overview: 'نظرة عامة',
      jobs: 'قاعدة بيانات الوظائف',
      companies: 'قاعدة بيانات الشركات',
      news: 'قاعدة بيانات الأخبار',
      notes: 'ملاحظات البحث',
      import: 'مركز الاستيراد',
      inspection: 'مركز فحص البيانات',
      search: 'البحث الشامل',
      schema: 'مخطط قاعدة البيانات',
      settings: 'الإعدادات',
    },

    actions: {
      add: 'إضافة جديد',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',
      view: 'عرض البيانات الخام',
      search: 'بحث',
      filter: 'تصفية',
      import: 'استيراد',
      export: 'تصدير',
      clear: 'مسح',
      confirm: 'تأكيد',
      close: 'إغلاق',
      copy: 'نسخ',
      copied: 'تم النسخ!',
    },

    fields: {
      id: 'المعرف',
      createdAt: 'تاريخ الإنشاء',
      updatedAt: 'تاريخ التحديث',
      source: 'المصدر',
      url: 'الرابط',
      notes: 'الملاحظات',
      rawText: 'النص الخام',
      dateCollected: 'تاريخ الجمع',
      industry: 'القطاع',
      location: 'الموقع',
    },

    jobs: {
      title: 'قاعدة بيانات الوظائف',
      subtitle: 'جمع وإدارة معلومات سوق العمل',
      fields: {
        title: 'المسمى الوظيفي',
        company: 'الشركة',
        industry: 'القطاع',
        location: 'الموقع',
        salary: 'نطاق الراتب',
        description: 'وصف الوظيفة',
        responsibilities: 'المهام والمسؤوليات',
        requirements: 'المتطلبات',
        source: 'منصة المصدر',
        dateCollected: 'تاريخ الجمع',
        originalUrl: 'الرابط الأصلي',
        rawText: 'النص الخام',
      },
    },

    companies: {
      title: 'قاعدة بيانات الشركات',
      subtitle: 'بناء سجل شامل لاستخبارات الشركات',
      fields: {
        name: 'اسم الشركة',
        industry: 'القطاع',
        website: 'الموقع الإلكتروني',
        description: 'الوصف',
        services: 'الخدمات / المنتجات',
        location: 'الموقع',
        notes: 'ملاحظات داخلية',
        sourceUrl: 'رابط المصدر',
        rawText: 'النص الخام',
      },
    },

    news: {
      title: 'قاعدة بيانات الأخبار',
      subtitle: 'متابعة أخبار السوق والتطورات الصناعية',
      fields: {
        headline: 'العنوان الرئيسي',
        source: 'مصدر الخبر',
        date: 'تاريخ النشر',
        summary: 'ملخص',
        fullContent: 'المحتوى الكامل',
        url: 'رابط المقال',
        industry: 'القطاع',
        rawText: 'النص الخام',
      },
    },

    notes: {
      title: 'ملاحظات البحث',
      subtitle: 'توثيق الملاحظات والرؤى ونتائج البحث',
      fields: {
        title: 'عنوان الملاحظة',
        category: 'الفئة',
        observation: 'الملاحظة',
        tags: 'الوسوم',
        date: 'التاريخ',
        rawText: 'النص الخام',
      },
    },

    import: {
      title: 'مركز الاستيراد',
      subtitle: 'استيراد البيانات من CSV أو JSON أو الإدخال اليدوي',
      csv: 'استيراد CSV',
      json: 'استيراد JSON',
      manual: 'إدخال يدوي',
      dragDrop: 'اسحب وأفلت الملف هنا',
      orClick: 'أو انقر للتصفح',
      selectTarget: 'اختر الجدول المستهدف',
      preview: 'معاينة',
      importing: 'جاري الاستيراد...',
      success: 'تم الاستيراد بنجاح',
      records: 'سجلات تم استيرادها',
      downloadTemplate: 'تنزيل القالب',
    },

    inspection: {
      title: 'مركز فحص البيانات',
      subtitle: 'فحص البيانات الخام من جميع مصادر الجمع',
      rawData: 'البيانات الخام',
      structuredData: 'البيانات المنظمة',
      metadata: 'البيانات الوصفية',
      originalSource: 'المصدر الأصلي',
      jsonView: 'عرض JSON',
      tableView: 'عرض الجدول',
    },

    globalSearch: {
      title: 'البحث الشامل',
      subtitle: 'البحث في جميع مجموعات البيانات',
      placeholder: 'ابحث في الوظائف والشركات والأخبار والملاحظات...',
      resultsIn: 'نتائج في',
      noResults: 'لا توجد نتائج',
      searching: 'جاري البحث...',
    },

    overview: {
      title: 'نظرة عامة على جمع البيانات',
      subtitle: 'حالة بيانات استخبارات السوق المجمعة في الوقت الفعلي',
      totalRecords: 'إجمالي السجلات',
      lastUpdated: 'آخر تحديث',
      dataHealth: 'جودة البيانات',
      recentActivity: 'النشاط الأخير',
      collectionStatus: 'حالة الجمع',
    },

    schema: {
      title: 'مخطط قاعدة البيانات',
      subtitle: 'تعريفات جداول Supabase وتعليمات الإعداد',
      copySQL: 'نسخ SQL',
      setupGuide: 'دليل الإعداد',
    },

    settings: {
      title: 'الإعدادات',
      subtitle: 'تكوين جامع السوق في ليكسينوديكس',
      supabaseUrl: 'رابط مشروع Supabase',
      supabaseKey: 'مفتاح Supabase المجهول',
      language: 'لغة الواجهة',
      save: 'حفظ التكوين',
      localMode: 'يعمل في الوضع المحلي',
      localModeDesc: 'البيانات مخزنة في localStorage المتصفح. قم بتوصيل Supabase للتخزين الدائم.',
      connectedMode: 'متصل بـ Supabase',
    },

    status: {
      loading: 'جاري التحميل...',
      saving: 'جاري الحفظ...',
      deleting: 'جاري الحذف...',
      noData: 'لا توجد سجلات',
      addFirst: 'أضف سجلك الأول للبدء',
      error: 'حدث خطأ',
      success: 'تمت العملية بنجاح',
      confirmDelete: 'هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.',
    },

    pagination: {
      showing: 'عرض',
      of: 'من',
      records: 'سجلات',
      prev: 'السابق',
      next: 'التالي',
      perPage: 'لكل صفحة',
    },
  },
};

export const useTranslation = (lang = 'en') => {
  const t = translations[lang] || translations.en;
  return { t, isRTL: lang === 'ar' };
};
