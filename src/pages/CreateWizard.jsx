import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, ChevronRight, ChevronLeft, Plus, Trash2,
  Eye, EyeOff, Copy, RefreshCw, UserCheck, Server,
  AlertTriangle, Info, CheckCircle2, X, Network, ArrowDownToLine
} from 'lucide-react';
import { REGIONS, TRANSPORTS, generateCredentials } from '../data';
import { useTrunks } from '../TrunkContext';

// ── Constants ────────────────────────────────────────────────────────────────
const ACCOUNT_ID = '664eeb61e0498715dc2dfeab';

// ── Inbound Routing Panel ────────────────────────────────────────────────────
function InboundRoutingPanel() {
  const [copied, setCopied] = useState(null);

  function copy(text, key) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  }

  const requestUri = `sip:+1123456789@${ACCOUNT_ID}.talkdesk.com`;
  const xHeader = `X-Account-Id: ${ACCOUNT_ID}`;

  return (
    <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-2.5">
        <ArrowDownToLine size={15} className="text-indigo-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-indigo-900">Inbound Routing — Required Carrier Configuration</h4>
          <p className="text-xs text-indigo-700 mt-0.5 leading-relaxed">
            Your carrier must identify the target Talkdesk account on every inbound INVITE using
            <strong> one</strong> of the two methods below.
          </p>
        </div>
      </div>

      {/* Method 1 */}
      <div className="bg-white rounded border border-indigo-100 p-3 space-y-1.5">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Method 1 — Request-URI domain</p>
        <p className="text-xs text-gray-500">
          Send INVITE to <code className="bg-gray-100 px-1 rounded">sip:&lt;user|number&gt;@{ACCOUNT_ID}.talkdesk.com</code>
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <code className="flex-1 font-mono text-xs bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-gray-700 truncate">
            {requestUri}
          </code>
          <button
            className="td-btn-ghost p-1.5 flex-shrink-0"
            onClick={() => copy(requestUri, 'uri')}
            title="Copy example"
          >
            {copied === 'uri' ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Method 2 */}
      <div className="bg-white rounded border border-indigo-100 p-3 space-y-1.5">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Method 2 — Custom SIP header</p>
        <p className="text-xs text-gray-500">
          Add the <code className="bg-gray-100 px-1 rounded">X-Account-Id</code> header to every inbound INVITE.
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <code className="flex-1 font-mono text-xs bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-gray-700 truncate">
            {xHeader}
          </code>
          <button
            className="td-btn-ghost p-1.5 flex-shrink-0"
            onClick={() => copy(xHeader, 'header')}
            title="Copy header"
          >
            {copied === 'header' ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Account ID copy */}
      <div className="flex items-center gap-2 pt-0.5">
        <span className="text-xs text-indigo-700">Your Account ID:</span>
        <code className="font-mono text-xs text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded flex-1 truncate">{ACCOUNT_ID}</code>
        <button
          className="td-btn-ghost p-1.5 flex-shrink-0"
          onClick={() => copy(ACCOUNT_ID, 'acctid')}
          title="Copy Account ID"
        >
          {copied === 'acctid' ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
        </button>
      </div>
    </div>
  );
}

const STEPS = [
  { id: 1, label: 'Region & Mode' },
  { id: 2, label: 'Endpoints' },
  { id: 3, label: 'Options & ACL' },
  { id: 4, label: 'Review' },
];

function StepIndicator({ current, maxReached }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;
        const reachable = step.id <= maxReached;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  done
                    ? 'bg-td-purple text-white'
                    : active
                    ? 'bg-td-purple text-white ring-4 ring-td-purple/20'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {done ? <Check size={14} /> : step.id}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                  active ? 'text-td-purple' : done ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-16 mt-[-14px] mx-2 ${done ? 'bg-td-purple' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1 ─────────────────────────────────────────────────────────────────
function Step1({ form, setForm, errors }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Region &amp; Registration Mode</h2>
        <p className="text-sm text-gray-500 mt-0.5">Choose where this trunk terminates and how your carrier connects.</p>
      </div>

      {/* Trunk name */}
      <div>
        <label className="td-label">Trunk Name <span className="text-red-500">*</span></label>
        <input
          className={`td-input ${errors.name ? 'border-red-400' : ''}`}
          placeholder="e.g. Carrier-Primary-EU"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Region */}
      <div>
        <label className="td-label">Region <span className="text-red-500">*</span></label>
        <select
          className={`td-select ${errors.region ? 'border-red-400' : ''}`}
          value={form.region}
          onChange={(e) => setForm({ ...form, region: e.target.value })}
        >
          <option value="">— Select a region —</option>
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
        {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
          <Info size={11} />
          Only one region per trunk. Multiple trunks can serve the same region.
        </p>
      </div>

      {/* Mode */}
      <div>
        <label className="td-label">Registration Mode <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              value: 'registered',
              Icon: UserCheck,
              title: 'Registered',
              desc: 'Your carrier registers to Talkdesk. We generate SIP credentials per endpoint.',
            },
            {
              value: 'static',
              Icon: Server,
              title: 'Static IP / FQDN',
              desc: "You provide your carrier's IP addresses or FQDNs. No registration required.",
            },
          ].map((opt) => {
            const selected = form.mode === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, mode: opt.value })}
                className={`flex flex-col gap-2 p-4 rounded-lg border-2 text-left transition-all ${
                  selected
                    ? 'border-td-purple bg-td-purple-light'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <opt.Icon size={20} className={selected ? 'text-td-purple' : 'text-gray-400'} />
                  {selected && <Check size={14} className="text-td-purple" />}
                </div>
                <div>
                  <div className={`font-semibold text-sm ${selected ? 'text-td-purple' : 'text-gray-800'}`}>
                    {opt.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{opt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.mode && <p className="text-red-500 text-xs mt-1">{errors.mode}</p>}
      </div>
    </div>
  );
}

// ── Step 2a — Registered ────────────────────────────────────────────────────
function Step2Registered({ form, setForm }) {
  const [showPasswords, setShowPasswords] = useState({});
  const region = REGIONS.find((r) => r.id === form.region);

  function regenerate() {
    const creds = generateCredentials(form.region, form.endpointCount);
    setForm({ ...form, credentials: creds });
  }

  function togglePass(id) {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function copyAll() {
    const csv = ['Endpoint,Username,Password', ...form.credentials.map(
      (c) => `${c.id},${c.username},${c.password}`
    )].join('\n');
    navigator.clipboard.writeText(csv).catch(() => {});
  }

  function handleCountChange(val) {
    const n = Math.max(1, Math.min(20, Number(val)));
    const creds = generateCredentials(form.region, n);
    setForm({ ...form, endpointCount: n, credentials: creds });
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">SIP Registration Credentials</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Select how many endpoints your carrier will register. We'll generate unique credentials for each.
        </p>
      </div>

      <div className="flex items-end gap-4">
        <div className="w-48">
          <label className="td-label">Number of endpoints</label>
          <input
            type="number"
            min="1"
            max="20"
            className="td-input"
            value={form.endpointCount}
            onChange={(e) => handleCountChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pb-0.5">
          <button className="td-btn-secondary" onClick={regenerate}>
            <RefreshCw size={13} />
            Regenerate all
          </button>
          <button className="td-btn-secondary" onClick={copyAll}>
            <Copy size={13} />
            Copy all as CSV
          </button>
        </div>
      </div>

      {/* Credentials table */}
      <div className="td-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SIP Username</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SIP Password</th>
              <th className="px-4 py-2.5 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {form.credentials.map((cred) => (
              <tr key={cred.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500 font-medium">{cred.id}</td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-gray-800">{cred.username}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-gray-800">
                    {showPasswords[cred.id] ? cred.password : '•'.repeat(12)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      className="td-btn-ghost p-1.5"
                      onClick={() => togglePass(cred.id)}
                      title={showPasswords[cred.id] ? 'Hide' : 'Show'}
                    >
                      {showPasswords[cred.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      className="td-btn-ghost p-1.5"
                      onClick={() => navigator.clipboard.writeText(`${cred.username}:${cred.password}`).catch(() => {})}
                      title="Copy"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info box */}
      {region && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-start gap-2.5">
          <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Configure your carrier to register to:{' '}
            <span className="font-mono font-semibold">{region.sbcHost}:5060</span>
          </p>
        </div>
      )}

      <InboundRoutingPanel />
    </div>
  );
}

// ── Step 2b — Static ────────────────────────────────────────────────────────
function Step2Static({ form, setForm, errors }) {
  function addEndpoint() {
    setForm({
      ...form,
      staticEndpoints: [...form.staticEndpoints, { id: Date.now(), value: '', transport: 'UDP' }],
    });
  }

  function removeEndpoint(id) {
    setForm({
      ...form,
      staticEndpoints: form.staticEndpoints.filter((e) => e.id !== id),
    });
  }

  function updateEndpoint(id, field, val) {
    setForm({
      ...form,
      staticEndpoints: form.staticEndpoints.map((e) =>
        e.id === id ? { ...e, [field]: val } : e
      ),
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Carrier Endpoints</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Add the IP addresses or FQDNs of your carrier's SIP endpoints.
        </p>
      </div>

      <div className="space-y-2.5">
        {form.staticEndpoints.map((ep, idx) => (
          <div key={ep.id} className="flex items-start gap-2.5">
            <div className="flex-shrink-0 w-6 h-9 flex items-center justify-center">
              <span className="text-xs text-gray-400 font-medium">{idx + 1}</span>
            </div>
            <div className="flex-1">
              <input
                className={`td-input ${errors[`ep-${ep.id}`] ? 'border-red-400' : ''}`}
                placeholder="e.g. 203.0.113.10 or sip.carrier.example.com"
                value={ep.value}
                onChange={(e) => updateEndpoint(ep.id, 'value', e.target.value)}
              />
              {errors[`ep-${ep.id}`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`ep-${ep.id}`]}</p>
              )}
            </div>
            <div className="w-48 flex-shrink-0">
              <select
                className="td-select"
                value={ep.transport}
                onChange={(e) => updateEndpoint(ep.id, 'transport', e.target.value)}
              >
                {TRANSPORTS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            {form.staticEndpoints.length > 1 && (
              <button
                className="td-btn-ghost p-2 text-red-400 hover:text-red-600 hover:bg-red-50 mt-0.5 flex-shrink-0"
                onClick={() => removeEndpoint(ep.id)}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        className="td-btn-secondary w-full justify-center border-dashed"
        onClick={addEndpoint}
      >
        <Plus size={14} />
        Add Endpoint
      </button>

      <InboundRoutingPanel />
    </div>
  );
}

// ── Step 3 — Options & ACL (static only) ────────────────────────────────────
function Step3({ form, setForm }) {
  const [aclInput, setAclInput] = useState('');

  function addAcl() {
    const val = aclInput.trim();
    if (!val || form.acl.includes(val)) return;
    setForm({ ...form, acl: [...form.acl, val] });
    setAclInput('');
  }

  function removeAcl(val) {
    setForm({ ...form, acl: form.acl.filter((v) => v !== val) });
  }

  function handleAclKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); addAcl(); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Keepalive &amp; Access Control</h2>
        <p className="text-sm text-gray-500 mt-0.5">Configure OPTIONS keepalive and restrict allowed source IPs.</p>
      </div>

      {/* OPTIONS keepalive */}
      <div className="td-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">SIP OPTIONS Keepalive</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Talkdesk will send SIP OPTIONS pings every 30 seconds to verify endpoint reachability.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, options: !form.options })}
            className={`flex-shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.options ? 'bg-td-purple' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                form.options ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {form.options && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-green-700">
            <CheckCircle2 size={12} className="text-green-500" />
            OPTIONS ping active — interval: 30s
          </div>
        )}
      </div>

      {/* ACL */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <label className="td-label mb-0">Allowed Source IPs / CIDR Ranges</label>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Optional — Advanced</span>
        </div>

        <div className="flex gap-2 mb-2">
          <input
            className="td-input"
            placeholder="e.g. 203.0.113.0/24 or 198.51.100.5"
            value={aclInput}
            onChange={(e) => setAclInput(e.target.value)}
            onKeyDown={handleAclKeyDown}
          />
          <button className="td-btn-secondary flex-shrink-0" onClick={addAcl}>
            <Plus size={13} />
            Add
          </button>
        </div>

        {form.acl.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {form.acl.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 font-mono text-xs px-2.5 py-1 rounded-full"
              >
                {v}
                <button onClick={() => removeAcl(v)} className="text-gray-400 hover:text-gray-600">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Warning banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2.5">
          <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>If no ACL rules are defined,</strong> Talkdesk will automatically allow traffic from the IP
            addresses and resolved DNS entries of the endpoints you configured. We recommend explicitly
            defining your allowed sources in production.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Step 4 — Review ─────────────────────────────────────────────────────────
function Step4({ form, onSubmit }) {
  const region = REGIONS.find((r) => r.id === form.region);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Review Configuration</h2>
        <p className="text-sm text-gray-500 mt-0.5">Please review your SIP trunk settings before creating.</p>
      </div>

      <div className="td-card divide-y divide-gray-100">
        {/* Trunk details */}
        <div className="px-5 py-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Trunk Details</h3>
          <div className="grid grid-cols-2 gap-y-2.5 text-sm">
            <span className="text-gray-500">Name</span>
            <span className="font-semibold text-gray-800">{form.name}</span>
            <span className="text-gray-500">Region</span>
            <span className="font-semibold text-gray-800 flex items-center gap-1.5">
              {region?.flag} {region?.label}
            </span>
            <span className="text-gray-500">Mode</span>
            <span className="font-semibold text-gray-800 capitalize">
              {form.mode === 'registered' ? 'Registered' : 'Static IP / FQDN'}
            </span>
          </div>
        </div>

        {/* Endpoints */}
        <div className="px-5 py-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Endpoints</h3>
          {form.mode === 'registered' ? (
            <div className="space-y-1.5">
              <p className="text-sm text-gray-600 mb-2">{form.credentials.length} endpoint{form.credentials.length !== 1 ? 's' : ''} with generated credentials</p>
              {form.credentials.map((c) => (
                <div key={c.id} className="flex items-center gap-2 text-sm bg-gray-50 rounded px-3 py-1.5">
                  <span className="font-mono text-gray-700">{c.username}</span>
                  <span className="text-gray-400">/ ••••••••••••</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {form.staticEndpoints.map((ep, i) => (
                <div key={ep.id} className="flex items-center gap-3 text-sm bg-gray-50 rounded px-3 py-1.5">
                  <span className="text-gray-400 w-4">{i + 1}</span>
                  <span className="font-mono text-gray-700 flex-1">{ep.value || '—'}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{ep.transport}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Options / ACL (static only) */}
        {form.mode === 'static' && (
          <div className="px-5 py-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Options &amp; ACL</h3>
            <div className="grid grid-cols-2 gap-y-2.5 text-sm">
              <span className="text-gray-500">OPTIONS Keepalive</span>
              <span className={`font-semibold ${form.options ? 'text-green-700' : 'text-gray-500'}`}>
                {form.options ? '✓ Enabled (30s interval)' : 'Disabled'}
              </span>
              <span className="text-gray-500">ACL Rules</span>
              <span className="font-semibold text-gray-800">
                {form.acl.length > 0
                  ? form.acl.join(', ')
                  : <span className="text-amber-600 font-normal">Auto-derived from endpoint IPs</span>}
              </span>
            </div>
          </div>
        )}
      </div>

      <button className="td-btn-primary w-full justify-center py-3 text-base" onClick={onSubmit}>
        <Network size={16} />
        Create SIP Trunk
      </button>
    </div>
  );
}

// ── Success State ────────────────────────────────────────────────────────────
function SuccessState({ name, onView }) {
  return (
    <div className="flex flex-col items-center text-center py-8 gap-5">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 size={36} className="text-green-500" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Trunk created successfully!</h2>
        <p className="text-gray-500 text-sm mt-1.5">
          <strong>{name}</strong> has been configured and is being provisioned.
        </p>
      </div>
      <button className="td-btn-primary py-2.5 px-6" onClick={onView}>
        <Network size={15} />
        View All Trunks
      </button>
    </div>
  );
}

// ── Wizard ───────────────────────────────────────────────────────────────────
function getInitialForm() {
  return {
    name: '',
    region: '',
    mode: '',
    endpointCount: 2,
    credentials: [],
    staticEndpoints: [{ id: 1, value: '', transport: 'UDP' }],
    options: true,
    acl: [],
  };
}

export default function CreateWizard() {
  const navigate = useNavigate();
  const { addTrunk } = useTrunks();
  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [form, setForm] = useState(getInitialForm);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  // Determine effective steps: skip step 3 if registered
  const effectiveSteps = form.mode === 'registered'
    ? [1, 2, 4]   // skip step 3
    : [1, 2, 3, 4];

  const currentIdx = effectiveSteps.indexOf(step);
  const isLast = currentIdx === effectiveSteps.length - 1;
  const isFirst = currentIdx === 0;

  function nextStep() {
    const errs = validate(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    // When leaving step 1 with mode=registered, generate initial credentials
    if (step === 1 && form.mode === 'registered' && form.credentials.length === 0) {
      const creds = generateCredentials(form.region, form.endpointCount);
      setForm((f) => ({ ...f, credentials: creds }));
    }

    const next = effectiveSteps[currentIdx + 1];
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
  }

  function prevStep() {
    setErrors({});
    setStep(effectiveSteps[currentIdx - 1]);
  }

  function validate(s) {
    const errs = {};
    if (s === 1) {
      if (!form.name.trim()) errs.name = 'Trunk name is required';
      if (!form.region) errs.region = 'Please select a region';
      if (!form.mode) errs.mode = 'Please select a registration mode';
    }
    if (s === 2 && form.mode === 'static') {
      form.staticEndpoints.forEach((ep) => {
        if (!ep.value.trim()) errs[`ep-${ep.id}`] = 'Endpoint address is required';
      });
    }
    return errs;
  }

  function handleSubmit() {
    const transports = form.mode === 'registered'
      ? ['UDP']
      : [...new Set(form.staticEndpoints.map((e) => e.transport))];

    addTrunk({
      name: form.name,
      region: form.region,
      mode: form.mode,
      transports,
      endpointCount: form.mode === 'registered' ? form.credentials.length : form.staticEndpoints.length,
      options: form.mode === 'static' ? form.options : false,
      acl: form.acl,
    });
    setDone(true);
  }

  function renderStep() {
    if (step === 1) return <Step1 form={form} setForm={setForm} errors={errors} />;
    if (step === 2 && form.mode === 'registered') return <Step2Registered form={form} setForm={setForm} />;
    if (step === 2 && form.mode === 'static') return <Step2Static form={form} setForm={setForm} errors={errors} />;
    if (step === 3) return <Step3 form={form} setForm={setForm} />;
    if (step === 4) return <Step4 form={form} onSubmit={handleSubmit} />;
  }

  if (done) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="td-card p-8">
          <SuccessState name={form.name} onView={() => navigate('/trunks')} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Back breadcrumb */}
      <button
        className="td-btn-ghost mb-5 text-gray-500"
        onClick={() => navigate('/trunks')}
      >
        <ChevronLeft size={15} />
        Back to SIP Trunks
      </button>

      <div className="td-card p-8">
        <StepIndicator current={step} maxReached={maxReached} />

        <div className="min-h-72">
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        {step !== 4 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              className="td-btn-secondary"
              onClick={isFirst ? () => navigate('/trunks') : prevStep}
            >
              <ChevronLeft size={14} />
              {isFirst ? 'Cancel' : 'Back'}
            </button>
            <button className="td-btn-primary" onClick={nextStep}>
              Continue
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button className="td-btn-ghost" onClick={prevStep}>
              <ChevronLeft size={14} />
              Back to edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
