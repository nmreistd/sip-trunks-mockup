import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Trash2, MoreVertical, Network, AlertCircle } from 'lucide-react';
import { StatusBadge, ModeBadge, TransportBadge, RegionBadge } from '../components/Badge';
import EndpointInfoPanel from '../components/EndpointInfoPanel';
import { useTrunks } from '../TrunkContext';

function DeleteModal({ trunk, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="td-card w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Delete SIP Trunk</h3>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-5">
          Are you sure you want to delete <strong>{trunk.name}</strong>? All associated endpoints and routing rules will be permanently removed.
        </p>
        <div className="flex gap-3 justify-end">
          <button className="td-btn-secondary" onClick={onCancel}>Cancel</button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            onClick={() => onConfirm(trunk.id)}
          >
            <Trash2 size={14} />
            Delete Trunk
          </button>
        </div>
      </div>
    </div>
  );
}

function TrunkRow({ trunk, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-td-purple-light flex items-center justify-center flex-shrink-0">
            <Network size={13} className="text-td-purple" />
          </div>
          <span className="font-semibold text-gray-800 text-sm">{trunk.name}</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <RegionBadge region={trunk.region} />
      </td>
      <td className="px-5 py-3.5">
        <ModeBadge mode={trunk.mode} />
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 flex-wrap">
          {trunk.transports.map((t) => (
            <TransportBadge key={t} transport={t} />
          ))}
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-sm text-gray-600">
          {trunk.endpointCount} endpoint{trunk.endpointCount !== 1 ? 's' : ''}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <StatusBadge status={trunk.status} />
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <button className="td-btn-secondary py-1 px-3 text-xs">
            <Settings size={12} />
            Configure
          </button>
          <div className="relative">
            <button
              className="td-btn-ghost p-1.5"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MoreVertical size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-10 w-40 td-card py-1 shadow-lg">
                <button
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  onClick={() => { setMenuOpen(false); onDelete(trunk); }}
                >
                  <Trash2 size={13} />
                  Delete Trunk
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ onNew }) {
  return (
    <div className="py-16 flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-td-purple-light flex items-center justify-center">
        <Network size={28} className="text-td-purple" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 text-base mb-1">No SIP trunks configured yet</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Connect your carrier by configuring your first SIP trunk.
        </p>
      </div>
      <button className="td-btn-primary" onClick={onNew}>
        <Plus size={15} />
        Configure New Trunk
      </button>
    </div>
  );
}

export default function TrunkList() {
  const navigate = useNavigate();
  const { trunks, deleteTrunk } = useTrunks();
  const [toDelete, setToDelete] = useState(null);

  function handleDelete(id) {
    deleteTrunk(id);
    setToDelete(null);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">SIP Trunks</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your SIP trunk connections</p>
        </div>
        <button className="td-btn-primary" onClick={() => navigate('/trunks/new')}>
          <Plus size={15} />
          Configure New Trunk
        </button>
      </div>

      {/* Trunk Table */}
      <div className="td-card overflow-hidden">
        {trunks.length === 0 ? (
          <EmptyState onNew={() => navigate('/trunks/new')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Region</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mode</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transport</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Endpoints</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {trunks.map((trunk) => (
                  <TrunkRow key={trunk.id} trunk={trunk} onDelete={setToDelete} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Endpoints info panel */}
      <EndpointInfoPanel />

      {/* Delete modal */}
      {toDelete && (
        <DeleteModal
          trunk={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
