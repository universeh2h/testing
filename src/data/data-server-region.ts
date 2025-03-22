// Server data definitions for all games
export const dataServerGenshin = [
  { name: 'America', value: 'os_usa' },
  { name: 'Europe', value: 'os_euro' },
  { name: 'Asia', value: 'os_asia' },
  { name: 'TW_HK_MO', value: 'os_cht' },
];
export const dataSeverHonkaiTarrail = [
  { name: 'America/USA', value: '|prod_official_usa' },
  { name: 'Europa', value: '|prod_official_eur' },
  { name: 'Asia', value: '|prod_official_asia' },
  { name: 'TW_HK_MO', value: '|prod_official_cht' },
];

export const ragnarokM = [
  { name: 'Eternal Love', value: '90001' },
  { name: 'Midnight Party', value: '90002' },
  { name: 'Memory Of Faith', value: '90002003' },
];

export const dataServerHeroesEvolved = [
  'North America - LOST TEMPLE [NA]',
  'North America - NEW ORDER',
  'Europe - ASGARD [EU]',
  'Europe - OLYMPUS [EU]',
  'South America - AMAZON [SA]',
  'South America - EL DORADO [SA]',
  'Asia - SHANGRI-LA [AS]',
  'Asia - S1.ANGKOR [AS]',
  'Asia - S2.EL NIDO [AS]',
  'Asia - ไทย[TH]',
  'Asia - ไทยแลนด์[TH]',
];

export const dataShellFire = [
  { name: 'Android', value: 'android' },
  { name: 'IOS', value: 'ios' },
];

export const RagnarokForeverLove = [{ name: 'ALL SERVER', value: 'allserver' }];

// New server data for additional games
export const dataMobileLegend = [
  { name: 'Global', value: 'global' },
  { name: 'South East Asia', value: 'sea' },
];

export const dataValorant = [
  { name: 'North America', value: 'na' },
  { name: 'Europe', value: 'eu' },
  { name: 'Asia Pacific', value: 'ap' },
  { name: 'Korea', value: 'kr' },
  { name: 'Latin America', value: 'latam' },
  { name: 'Brazil', value: 'br' },
];

export const dataPubgMobile = [
  { name: 'Global', value: 'global' },
  { name: 'Korea', value: 'kr' },
  { name: 'Vietnam', value: 'vn' },
  { name: 'Taiwan', value: 'tw' },
];

export const dataLeagueOfLegends = [
  { name: 'North America', value: 'na' },
  { name: 'Europe West', value: 'euw' },
  { name: 'Europe Nordic & East', value: 'eune' },
  { name: 'Oceania', value: 'oce' },
  { name: 'Latin America North', value: 'lan' },
  { name: 'Latin America South', value: 'las' },
  { name: 'Brazil', value: 'br' },
  { name: 'Japan', value: 'jp' },
  { name: 'Russia', value: 'ru' },
  { name: 'Turkey', value: 'tr' },
];

export const dataArenaOfValor = [
  { name: 'Asia', value: 'asia' },
  { name: 'Europe', value: 'eu' },
  { name: 'North America', value: 'na' },
  { name: 'Latin America', value: 'latam' },
];

export const dataUndawn = [
  { name: 'Global', value: 'global' },
  { name: 'SEA', value: 'sea' },
];

export const dataCallOfDutyMobile = [
  { name: 'Global', value: 'global' },
  { name: 'Garena', value: 'garena' },
];

export const dataFCMobile = [{ name: 'Global', value: 'global' }];

export const dataMetalSlugAwakening = [
  { name: 'Global', value: 'global' },
  { name: 'SEA', value: 'sea' },
];

export const dataEggyParty = [{ name: 'Global', value: 'global' }];

export const dataFreeFire = [
  { name: 'Global', value: 'global' },
  { name: 'India', value: 'india' },
];

export const dataHonorOfKings = [
  { name: 'Global', value: 'global' },
  { name: 'China', value: 'china' },
];

export const dataPointBlank = [
  { name: 'Global', value: 'global' },
  { name: 'Indonesia', value: 'id' },
  { name: 'Thailand', value: 'th' },
  { name: 'Brazil', value: 'br' },
];

export const dataBloodStrike = [{ name: 'Global', value: 'global' }];

export const dataLoveAndDeepspace = [{ name: 'Global', value: 'global' }];

export const dataStumbleGuys = [{ name: 'Global', value: 'global' }];

export const dataRoblox = [{ name: 'Global', value: 'global' }];

export const dataZenlessZoneZero = [
  { name: 'Global', value: 'global' },
  { name: 'Asia', value: 'asia' },
  { name: 'Europe', value: 'europe' },
  { name: 'America', value: 'america' },
];

export const dataBlackCloverM = [{ name: 'Global', value: 'global' }];

export const dataInfiniteBorders = [{ name: 'Global', value: 'global' }];

export const dataLaplaceM = [
  { name: 'Global', value: 'global' },
  { name: 'SEA', value: 'sea' },
];

export const dataHago = [{ name: 'Global', value: 'global' }];

export const dataSpeedDrifters = [
  { name: 'Global', value: 'global' },
  { name: 'SEA', value: 'sea' },
];

export const dataAU2Mobile = [{ name: 'Global', value: 'global' }];

export const dataEternalCity = [{ name: 'Global', value: 'global' }];

export const dataSkyChildrenOfTheLight = [{ name: 'Global', value: 'global' }];

export const dataFarlight84 = [{ name: 'Global', value: 'global' }];

export const dataDraconiaSaga = [{ name: 'Global', value: 'global' }];

export const dataTarisland = [
  { name: 'Global', value: 'global' },
  { name: 'NA', value: 'na' },
  { name: 'EU', value: 'eu' },
  { name: 'Asia', value: 'asia' },
];

export const dataDefaultEmpty = [{ name: 'Default', value: 'default' }];

// Enhanced getServerData function
export const getServerData = (code: string) => {
  switch (code) {
    case 'genshin-impact':
      return dataServerGenshin;
    case 'honkai-star-rail':
      return dataSeverHonkaiTarrail;
    case 'ragnarok-m':
      return ragnarokM;
    case 'heroes-evolved':
      return dataServerHeroesEvolved;
    case 'shell-fire':
      return dataShellFire;
    case 'ragnarok-forever-love':
      return RagnarokForeverLove;
    case 'valorant':
      return dataValorant;
    case 'pubg-mobile':
      return dataPubgMobile;
    case 'league-of-legends':
      return dataLeagueOfLegends;
    case 'arena-of-valor':
      return dataArenaOfValor;
    case 'UNDAWN':
    case 'undawn':
      return dataUndawn;
    case 'call-of-duty-mobile':
      return dataCallOfDutyMobile;
    case 'fc-mobile':
      return dataFCMobile;
    case 'metal-slug-awakening':
      return dataMetalSlugAwakening;
    case 'eggy-party':
      return dataEggyParty;
    case 'free-fire':
      return dataFreeFire;
    case 'Honor-Of-Kings':
    case 'honor-of-kings':
      return dataHonorOfKings;
    case 'pb':
      return dataPointBlank;
    case 'blood-strike':
      return dataBloodStrike;
    case 'Love-and-Deepspace':
    case 'love-and-deepspace':
      return dataLoveAndDeepspace;
    case 'stumble-guys':
      return dataStumbleGuys;
    case 'roblox':
      return dataRoblox;
    case 'zenless-zone-zero':
      return dataZenlessZoneZero;
    case 'black-clover-m':
      return dataBlackCloverM;
    case 'infinite-borders':
      return dataInfiniteBorders;
    case 'laplace-m':
      return dataLaplaceM;
    case 'hago':
      return dataHago;
    case 'speed-drifters':
      return dataSpeedDrifters;
    case 'au2-mobile':
      return dataAU2Mobile;
    case 'eternal-city':
      return dataEternalCity;
    case 'Sky-Children-of-the-Light':
    case 'sky-children-of-the-light':
      return dataSkyChildrenOfTheLight;
    case 'Farlight-84':
    case 'farlight-84':
      return dataFarlight84;
    case 'Draconia-Saga':
    case 'draconia-saga':
      return dataDraconiaSaga;
    case 'Tarisland':
    case 'tarisland':
      return dataTarisland;
    case 'telkomsel':
    case 'indosat':
    case 'axis':
    case 'three':
    case 'xl':
    case 'by.U':
    case 'voucher-garena':
    case 'voucher-unipin':
    case 'google-play':
    case 'steam-wallet':
    case 'pln':
      return dataDefaultEmpty;

    default:
      return undefined;
  }
};
