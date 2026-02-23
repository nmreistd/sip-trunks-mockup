import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Server, Wifi } from 'lucide-react';
import { REGIONS } from '../data';

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button onClick={copy} className="td-btn-ghost text-xs py-1 px-2">
      {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function RegionCard({ region }) {
  const allSrv = region.srv
    .map((s) => `${s.proto}.${s.host}  →  ${s.target}:${s.port}`)
    .join('\n');

  return (
    <div className="td-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{region.flag}</span>
          <div>
            <span className="font-mono font-semibold text-gray-800 text-sm">{region.id}</span>
            <span className="text-gray-500 text-xs ml-1">— {region.shortLabel}</span>
          </div>
        </div>
        <CopyBtn text={allSrv} />
      </div>

      {/* SRV Records */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Server size={11} className="text-gray-400" />
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">SIP SRV Records</span>
        </div>
        <div className="bg-gray-50 rounded-md border border-gray-100 divide-y divide-gray-100">
          {region.srv.map((s) => (
            <div key={s.proto} className="px-3 py-1.5 flex items-center justify-between gap-2 text-xs">
              <span className="font-mono text-indigo-700 font-medium min-w-0 truncate">
                {s.proto}.{s.host}
              </span>
              <span className="text-gray-400 flex-shrink-0">→</span>
              <span className="font-mono text-gray-700 flex-shrink-0">
                {s.target}:{s.port}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Media Engine */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Wifi size={11} className="text-gray-400" />
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Media Engine</span>
        </div>
        <div className="bg-gray-50 rounded-md border border-gray-100 px-3 py-2 text-xs space-y-1">
          <div className="flex gap-2">
            <span className="text-gray-500 w-20 flex-shrink-0">IP Ranges:</span>
            <span className="font-mono text-gray-700">{region.mediaIPs.join(', ')}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 w-20 flex-shrink-0">RTP Ports:</span>
            <span className="font-mono text-gray-700">{region.rtpPorts}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EndpointInfoPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="td-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Server size={15} className="text-td-purple" />
          <span className="font-semibold text-gray-800 text-sm">Talkdesk SIP Endpoints &amp; Media Engine</span>
          <span className="text-xs text-gray-400 font-normal">— Available regions &amp; connection details</span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-100 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REGIONS.map((r) => (
              <RegionCard key={r.id} region={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
