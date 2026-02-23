// Static region data
export const REGIONS = [
  {
    id: 'eu2',
    label: 'eu2 — Europe (Frankfurt)',
    shortLabel: 'Europe',
    flag: '🇩🇪',
    srv: [
      { proto: '_sip._udp', host: 'eu2.sip.talkdesk.com', target: 'sbc-eu2-01.sip.talkdesk.com', port: 5060 },
      { proto: '_sip._tcp', host: 'eu2.sip.talkdesk.com', target: 'sbc-eu2-01.sip.talkdesk.com', port: 5060 },
      { proto: '_sips._tcp', host: 'eu2.sip.talkdesk.com', target: 'sbc-eu2-01.sip.talkdesk.com', port: 5061 },
    ],
    mediaIPs: ['185.20.144.0/24', '185.20.145.0/24'],
    rtpPorts: '10000–20000',
    sbcHost: 'sbc-eu2-01.sip.talkdesk.com',
  },
  {
    id: 'us1',
    label: 'us1 — United States (N. Virginia)',
    shortLabel: 'United States',
    flag: '🇺🇸',
    srv: [
      { proto: '_sip._udp', host: 'us1.sip.talkdesk.com', target: 'sbc-us1-01.sip.talkdesk.com', port: 5060 },
      { proto: '_sip._tcp', host: 'us1.sip.talkdesk.com', target: 'sbc-us1-01.sip.talkdesk.com', port: 5060 },
      { proto: '_sips._tcp', host: 'us1.sip.talkdesk.com', target: 'sbc-us1-01.sip.talkdesk.com', port: 5061 },
    ],
    mediaIPs: ['34.192.0.0/24', '34.193.0.0/24'],
    rtpPorts: '10000–20000',
    sbcHost: 'sbc-us1-01.sip.talkdesk.com',
  },
  {
    id: 'sa1',
    label: 'sa1 — South America (São Paulo)',
    shortLabel: 'South America',
    flag: '🇧🇷',
    srv: [
      { proto: '_sip._udp', host: 'sa1.sip.talkdesk.com', target: 'sbc-sa1-01.sip.talkdesk.com', port: 5060 },
      { proto: '_sip._tcp', host: 'sa1.sip.talkdesk.com', target: 'sbc-sa1-01.sip.talkdesk.com', port: 5060 },
      { proto: '_sips._tcp', host: 'sa1.sip.talkdesk.com', target: 'sbc-sa1-01.sip.talkdesk.com', port: 5061 },
    ],
    mediaIPs: ['177.71.144.0/24', '177.71.145.0/24'],
    rtpPorts: '10000–20000',
    sbcHost: 'sbc-sa1-01.sip.talkdesk.com',
  },
  {
    id: 'ap1',
    label: 'ap1 — Asia Pacific (Singapore)',
    shortLabel: 'Asia Pacific',
    flag: '🇸🇬',
    srv: [
      { proto: '_sip._udp', host: 'ap1.sip.talkdesk.com', target: 'sbc-ap1-01.sip.talkdesk.com', port: 5060 },
      { proto: '_sip._tcp', host: 'ap1.sip.talkdesk.com', target: 'sbc-ap1-01.sip.talkdesk.com', port: 5060 },
      { proto: '_sips._tcp', host: 'ap1.sip.talkdesk.com', target: 'sbc-ap1-01.sip.talkdesk.com', port: 5061 },
    ],
    mediaIPs: ['13.228.0.0/24', '13.229.0.0/24'],
    rtpPorts: '10000–20000',
    sbcHost: 'sbc-ap1-01.sip.talkdesk.com',
  },
];

export const TRANSPORTS = [
  { value: 'UDP', label: 'UDP (port 5060)' },
  { value: 'TCP', label: 'TCP (port 5060)' },
  { value: 'TLS', label: 'TLS (port 5061)' },
];

// Seed trunks
export const SEED_TRUNKS = [
  {
    id: 'trunk-001',
    name: 'Carrier-Primary',
    region: 'eu2',
    mode: 'static',
    transports: ['TLS'],
    endpointCount: 2,
    status: 'active',
    options: true,
    acl: ['185.60.10.0/24'],
  },
  {
    id: 'trunk-002',
    name: 'Backup-US',
    region: 'us1',
    mode: 'registered',
    transports: ['UDP', 'TCP'],
    endpointCount: 3,
    status: 'active',
    options: false,
    acl: [],
  },
  {
    id: 'trunk-003',
    name: 'APAC-Trunk',
    region: 'ap1',
    mode: 'static',
    transports: ['TCP'],
    endpointCount: 1,
    status: 'pending',
    options: true,
    acl: [],
  },
];

// Credential generator
export function generateCredentials(region, count) {
  return Array.from({ length: count }, (_, i) => {
    const hex = Math.random().toString(16).slice(2, 8);
    return {
      id: i + 1,
      username: `tdtrunk-${region}-${hex}`,
      password: Math.random().toString(36).slice(2, 14) + Math.random().toString(36).slice(2, 6),
    };
  });
}

export function getRegion(id) {
  return REGIONS.find((r) => r.id === id);
}
