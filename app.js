(() => {
  const db = window.QUYDAT_DATA;
  if (!db || !Array.isArray(db.assets)) {
    document.body.innerHTML = '<main class="container"><div class="notice">Không nạp được dữ liệu.</div></main>';
    return;
  }
  const assets = db.assets;
  const $ = (id) => document.getElementById(id);
  const fmtNum = (v, digits=1) => v == null ? '—' : new Intl.NumberFormat('vi-VN',{maximumFractionDigits:digits}).format(v);
  const fmtMoney = (v) => v == null ? '—' : new Intl.NumberFormat('vi-VN').format(v) + ' ₫';
  const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const normalize = (s='') => s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();

  let state = { search:'', status:'', decision:'', plan:'', quality:'', sort:'asset_id', dir:1 };

  const statuses = [...new Map(assets.map(a => [a.status, a.status_label])).entries()];
  statuses.forEach(([value,label]) => $('statusFilter').insertAdjacentHTML('beforeend',`<option value="${value}">${esc(label)}</option>`));
  [...new Set(assets.map(a => a.decision_no).filter(Boolean))].sort().forEach(v => $('decisionFilter').insertAdjacentHTML('beforeend',`<option>${esc(v)}</option>`));

  function setKpis() {
    const total = assets.length;
    const count = code => assets.filter(a=>a.status===code).length;
    $('kpiTotal').textContent = total;
    $('kpiReceived').textContent = count('received');
    $('kpiSurveyed').textContent = count('surveyed_not_received');
    $('kpiNotContacted').textContent = count('not_contacted');
    const pct = n => (n*100/total).toLocaleString('vi-VN',{maximumFractionDigits:1})+'%';
    $('pctReceived').textContent=pct(count('received'));
    $('pctSurveyed').textContent=pct(count('surveyed_not_received'));
    $('pctNotContacted').textContent=pct(count('not_contacted'));
    $('kpiLease').textContent = assets.filter(a=>a.plans.some(p=>p.mode==='short_term_lease')).length;
    $('kpiInvest').textContent = assets.filter(a=>a.plans.some(p=>p.mode==='investment_call')).length;
    $('progressStack').innerHTML = [
      ['received','seg-received'],['surveyed_not_received','seg-surveyed'],['not_contacted','seg-pending']
    ].map(([s,c])=>`<span class="${c}" style="width:${count(s)*100/total}%"></span>`).join('');
  }

  function filtered() {
    const q = normalize(state.search.trim());
    let out = assets.filter(a => {
      const hay = normalize([a.asset_id,a.name,a.address,a.decision_no,a.handover_unit,a.progress_note].filter(Boolean).join(' '));
      if (q && !hay.includes(q)) return false;
      if (state.status && a.status !== state.status) return false;
      if (state.decision && a.decision_no !== state.decision) return false;
      if (state.plan === 'none' && a.plans.length) return false;
      if (state.plan && state.plan !== 'none' && !a.plans.some(p=>p.mode===state.plan)) return false;
      if (state.quality === 'warning' && !a.quality_flags.length) return false;
      if (state.quality === 'clean' && a.quality_flags.length) return false;
      return true;
    });
    const key = state.sort;
    out.sort((a,b)=>{
      let av=a[key], bv=b[key];
      if (key==='status') { av=a.status_label; bv=b.status_label; }
      if (av == null) return 1; if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av-bv)*state.dir;
      return String(av).localeCompare(String(bv),'vi')*state.dir;
    });
    return out;
  }

  function render() {
    const rows = filtered();
    $('resultCount').textContent = rows.length;
    $('filteredArea').textContent = fmtNum(rows.reduce((s,a)=>s+(a.land_area_m2||0),0));
    $('assetRows').innerHTML = rows.map(a => {
      const plans = a.plans.length ? a.plans.map(p=>`<span class="badge plan">${esc(p.mode_label)}</span>`).join(' ') : '<span class="asset-address">—</span>';
      const quality = a.quality_flags.length ? `<span class="badge quality">⚠ ${a.quality_flags.length}</span>` : '—';
      return `<tr data-id="${a.asset_id}">
        <td><code>${a.asset_id}</code></td>
        <td><span class="asset-name">${esc(a.name)}</span><span class="asset-address">${esc(a.address||'Chưa có địa chỉ chuẩn hóa')}</span></td>
        <td><span class="badge ${a.status}">${esc(a.status_label)}</span></td>
        <td>${esc(a.decision_no||'—')}<span class="asset-address">${esc(a.decision_date||'')}</span></td>
        <td class="num">${fmtNum(a.land_area_m2)} m²</td>
        <td>${plans}</td>
        <td>${quality}</td>
      </tr>`;
    }).join('');
    document.querySelectorAll('#assetRows tr').forEach(tr => tr.addEventListener('click',()=>showDetail(tr.dataset.id)));
  }

  function showDetail(id) {
    const a = assets.find(x=>x.asset_id===id); if(!a) return;
    $('detailHint').textContent = `${a.asset_id} · ${a.status_label}`;
    const plans = a.plans.length ? a.plans.map(p=>`
      <div class="detail-card full">
        <label>${esc(p.mode_label)} · Phụ lục ${p.appendix}, STT ${p.appendix_stt}</label>
        <strong>Diện tích phương án: ${fmtNum(p.plan_area_m2)} m²</strong>
        <p class="plan-note">${esc(p.note||'Nguồn không ghi chú chi tiết.')}</p>
      </div>`).join('') : '<div class="detail-card full"><label>Phương án khai thác</label><strong>Chưa gắn Phụ lục 4/5</strong></div>';
    const flags = a.quality_flags.length ? a.quality_flags.map(f=>`<span class="badge quality">${esc(f)}</span>`).join(' ') : 'Không có cảnh báo tự động.';
    $('detailPanel').className='detail';
    $('detailPanel').innerHTML=`
      <div class="detail-card wide"><label>Tên cơ sở</label><strong>${esc(a.name)}</strong></div>
      <div class="detail-card wide"><label>Địa chỉ</label><strong>${esc(a.address||'—')}</strong></div>
      <div class="detail-card"><label>Trạng thái</label><span class="badge ${a.status}">${esc(a.status_label)}</span></div>
      <div class="detail-card"><label>Quyết định</label><strong>${esc(a.decision_no||'—')}</strong><p>${esc(a.decision_date||'')}</p></div>
      <div class="detail-card"><label>Diện tích đất hồ sơ</label><strong>${fmtNum(a.land_area_m2)} m²</strong></div>
      <div class="detail-card"><label>Diện tích nhà</label><strong>${fmtNum(a.building_area_m2)} m²</strong></div>
      <div class="detail-card"><label>Nguyên giá</label><strong>${fmtMoney(a.original_value_vnd)}</strong></div>
      <div class="detail-card"><label>Giá trị còn lại</label><strong>${fmtMoney(a.residual_value_vnd)}</strong></div>
      <div class="detail-card wide"><label>Đơn vị bàn giao</label><strong>${esc(a.handover_unit||'—')}</strong></div>
      <div class="detail-card wide"><label>Tiến độ/diễn giải</label><p>${esc(a.progress_note||'—')}</p></div>
      <div class="detail-card full"><label>Cảnh báo chất lượng</label>${flags}</div>
      ${plans}`;
  }

  function exportCsv(){
    const rows=filtered();
    const head=['asset_id','name','address','status','decision_no','land_area_m2','plans','quality_flags'];
    const quote=v=>`"${String(v??'').replaceAll('"','""')}"`;
    const body=[head.join(','),...rows.map(a=>[
      a.asset_id,a.name,a.address,a.status_label,a.decision_no,a.land_area_m2,
      a.plans.map(p=>p.mode_label).join('|'),a.quality_flags.join('|')
    ].map(quote).join(','))].join('\r\n');
    const blob=new Blob(['\uFEFF'+body],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob), x=document.createElement('a');
    x.href=url;x.download='quydat-2026-filtered.csv';x.click();URL.revokeObjectURL(url);
  }

  function bind(id,key,event='change'){$(id).addEventListener(event,e=>{state[key]=e.target.value;render()})}
  bind('searchInput','search','input');bind('statusFilter','status');bind('decisionFilter','decision');bind('planFilter','plan');bind('qualityFilter','quality');
  $('resetBtn').addEventListener('click',()=>{state={...state,search:'',status:'',decision:'',plan:'',quality:''};['searchInput','statusFilter','decisionFilter','planFilter','qualityFilter'].forEach(id=>$(id).value='');render()});
  $('exportBtn').addEventListener('click',exportCsv);
  document.querySelectorAll('th[data-sort]').forEach(th=>th.addEventListener('click',()=>{const k=th.dataset.sort;state.dir=state.sort===k?-state.dir:1;state.sort=k;render()}));
  $('themeBtn').addEventListener('click',()=>{document.documentElement.classList.toggle('dark');localStorage.setItem('quydat-theme',document.documentElement.classList.contains('dark')?'dark':'light')});
  if(localStorage.getItem('quydat-theme')==='dark')document.documentElement.classList.add('dark');

  const findings=[
    ['high','Sai lệch tổng 08/62 nhưng “còn lại 55”','Theo phân nhóm 8 + 25 + 29 = 62, số chưa tiếp nhận phải là 54.'],
    ['high','Tổng 14.582,5 m² cần xác nhận','Con số này khớp 7 cơ sở nếu không tính Huyện đội thị xã Bình Minh.'],
    ['medium','Diện tích Huyện đội Bình Minh không thống nhất','Hồ sơ cũ 4.568,8 m²; Phụ lục 4/5 dùng 3.928,2 m².'],
    ['medium','Diện tích Trung tâm CNTT-TT không thống nhất','Phụ lục 2: 1.226,0 m²; Phụ lục 4/5: 1.218,5 m².'],
    ['high','Có phương án khai thác trước khi hoàn tất tiếp nhận','Trung tâm CNTT-TT đang ở nhóm đã khảo sát nhưng chưa tiếp nhận, đồng thời có trong Phụ lục 4 và 5.']
  ];
  $('qualityFindings').innerHTML=findings.map(f=>`<div class="finding ${f[0]}"><b>${esc(f[1])}</b><span>${esc(f[2])}</span></div>`).join('');
  setKpis();render();
})();
