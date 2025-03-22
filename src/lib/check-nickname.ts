import { BASE_URL_VALIDATE_NICKNAME } from '@/constants';
import { CheckNickNameReq, validateCheckNickNameReq } from '@/data/check-code';

interface Result {
  success: boolean;
  game?: string;
  id?: number | string;
  server?: string | number;
  name?: string;
  message?: string;
}

export async function CheckNickName(
  request: CheckNickNameReq
): Promise<Result> {
  if (!validateCheckNickNameReq(request)) {
    throw new Error('Invalid request data');
  }

  console.log('Request data:', request);

  let url = `${BASE_URL_VALIDATE_NICKNAME}/default?id=${request.userId}`;

  // Kasus khusus untuk Mobile Legends
  if (request.type === 'mobile-legend') {
    url = `${BASE_URL_VALIDATE_NICKNAME}/ml?id=${parseInt(
      request.userId
    )}&server=${request.serverId}`;
  } else if (request.type === 'genshin-impact') {
    url = `${BASE_URL_VALIDATE_NICKNAME}/gi?id=${request.userId}`;
  } else if (request.type === 'honkai-star-rail') {
    url = `${BASE_URL_VALIDATE_NICKNAME}/hsr?id=${parseInt(request.userId)}`;
  } else if (request.type === 'free-fire') {
    url = `${BASE_URL_VALIDATE_NICKNAME}/ff?id=${parseInt(request.userId)}`;
  } else if (request.type === 'valorant') {
    url = `${BASE_URL_VALIDATE_NICKNAME}/valo?id=${encodeURIComponent(
      parseInt(request.userId)
    )}`;
  } else if (request.type === 'arena-of-valor') {
    url = `${BASE_URL_VALIDATE_NICKNAME}/aov?id=${encodeURIComponent(
      parseInt(request.userId)
    )}`;
  } else if (request.type === 'call-of-duty-mobile') {
    url = `${BASE_URL_VALIDATE_NICKNAME}/cod?id=${encodeURIComponent(
      parseInt(request.userId)
    )}`;
  } else if (request.type === 'aether-gazer') {
    url = `${BASE_URL_VALIDATE_NICKNAME}/ag?id=${encodeURIComponent(
      parseInt(request.userId)
    )}`;
  } else if (request.type === 'punishing-gray-raven') {
    url = `${BASE_URL_VALIDATE_NICKNAME}/ag?id=${encodeURIComponent(
      parseInt(request.userId)
    )}`;
  } else if (request.type === 'point-blank') {
    url = `${BASE_URL_VALIDATE_NICKNAME}/pb?id=${encodeURIComponent(
      parseInt(request.userId)
    )}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    const data = await response.json();
    console.log(data);
    return {
      success: data.success || false,
      game: request.type,
      id: request.userId,
      server: data.server || null,
      name: data.name || null,
      message: data.message || null,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error checking nickname: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
