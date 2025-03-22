export type GameType =
  | 'genshin-impact'
  | 'honkai-star-rail'
  | 'league-of-legends'
  | 'arena-of-valor'
  | 'UNDAWN'
  | 'call-of-duty-mobile'
  | 'fc-mobile'
  | 'metal-slug-awakening'
  | 'eggy-party'
  | 'blood-strike'
  | 'Love-and-Deepspace'
  | 'stumble-guys'
  | 'black-clover-m'
  | 'infinite-borders'
  | 'laplace-m'
  | 'hago'
  | 'speed-drifters'
  | 'au2-mobile'
  | 'eternal-city'
  | 'Sky-Children-of-the-Light'
  | 'Farlight-84'
  | 'Draconia-Saga'
  | 'Tarisland'
  | 'aether-gazer'
  | 'lifeafter'
  | 'point-blank'
  | 'punishing-gray-raven'
  | 'sausage-man'
  | 'super-sus'
  | 'valorant'
  | 'zenless-zone-zero'
  | 'free-fire'
  | 'mobile-legend';

export interface CheckNickNameReq {
  userId: string;
  serverId?: string;
  type: GameType;
}

export function validateCheckNickNameReq(data: CheckNickNameReq): boolean {
  if (!data.userId || typeof data.userId !== 'string') return false;
  if (data.serverId && typeof data.serverId !== 'string') return false;
  if (!data.type || !isValidGameType(data.type)) return false;
  return true;
}

function isValidGameType(type: string): type is GameType {
  return [
    'genshin-impact',
    'honkai-star-rail',
    'league-of-legends',
    'arena-of-valor',
    'UNDAWN',
    'call-of-duty-mobile',
    'fc-mobile',
    'metal-slug-awakening',
    'eggy-party',
    'blood-strike',
    'Love-and-Deepspace',
    'stumble-guys',
    'black-clover-m',
    'infinite-borders',
    'laplace-m',
    'hago',
    'speed-drifters',
    'au2-mobile',
    'eternal-city',
    'Sky-Children-of-the-Light',
    'Farlight-84',
    'Draconia-Saga',
    'Tarisland',
    'aether-gazer',
    'lifeafter',
    'point-blank',
    'punishing-gray-raven',
    'sausage-man',
    'super-sus',
    'valorant',
    'zenless-zone-zero',
    'free-fire',
    'mobile-legend',
  ].includes(type);
}

export const GAMES_WITH_VALIDATION = [
  'mobile-legend',
  'genshin-impact',
  'honkai-star-rail',
  'free-fire',
  'valorant',
  'arena-of-valor',
  'call-of-duty-mobile',
  'aether-gazer',
  'punishing-gray-raven',
];
