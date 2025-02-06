const ASF_API_URL = 'https://api.daac.asf.alaska.edu/services/search/param';

export interface ASFSearchParams {
  bbox?: string;
  platform?: string;
  processingLevel?: string;
  beamMode?: string;
  start?: string;
  end?: string;
}

export interface ASFGranule {
  granuleName: string;
  downloadUrl: string;
  browse: string;
  path: number;
  frame: number;
  centerLat: number;
  centerLon: number;
  processingLevel: string;
  platform: string;
  beamMode: string;
  acquisitionDate: string;
}

export const searchASFGranules = async (params: ASFSearchParams): Promise<ASFGranule[]> => {
  const searchParams = new URLSearchParams({
    output: 'json',
    ...params,
  });

  try {
    const response = await fetch(`${ASF_API_URL}?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error('ASF API request failed');
    }
    const data = await response.json();
    
    // Transform the response to include download URLs
    return (data.results || []).map((result: any) => ({
      ...result,
      downloadUrl: `https://datapool.asf.alaska.edu/${result.downloadUrl}`,
    }));
  } catch (error) {
    console.error('Error fetching ASF data:', error);
    throw error;
  }
};