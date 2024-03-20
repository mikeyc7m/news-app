// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export type Data = {
  response: {
    status: string
    error?: string
    results?: [Result] | []
  }
}

type Result = {
  webTitle: string
  webUrl: string
  sectionName: string
  webPublicationDate: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const url = 'http://localhost:3000/guardian_api.json?';
  try {
    const { q } = req.query || {};
    const searchStr = Array.isArray(q) ? q.join(' ') : q;
    const fetchData = async () => await fetch(url + '&q=' + encodeURI(searchStr))
      .then(response => {
        if (!(response && response.ok)) throw response;
        return response.json();
      });
    return fetchData().then(value => {
      const { response: { results } }: Data = value;
      const filteredResults = results?.filter(obj => (obj.webTitle).toLowerCase().indexOf(searchStr.toLowerCase()) !== -1);
      const data = { ...value };
      data.response.results = filteredResults;
      return res.status(200).json(data);
    });
  } catch (err) {
    res.status(500).json({ response: { status: 'error', error: 'Sorry Dave, I\'m afraid I can\'t do that.' } });
  }
}
