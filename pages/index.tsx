import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Fragment, ReactChild, ReactFragment, ReactPortal, useState } from 'react';
import { Data } from './api/hello';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [pinnedList, setPinnedList] = useState([]);

  async function fetchData() {
    setError(false);
    setLoading(true);
    /* fake some loading delay... */
    return new Promise(() => setTimeout(fetchingData, 3));
  }

  const fetchingData = () => {
    const rand = Math.floor(Math.random() * 5);
    if (rand === 91) {
      setError(true);
      setLoading(false);
    } else {
      //const url = 'https://content.guardianapis.com/search?api-key=test&';
      const url = 'api/hello?';
      const result = async () => await fetch(url + 'q=' + inputValue)
        .then(response => {
          if (!(response && response.ok)) throw response;
          return response.json();
        });
      result().then(value => {
        setData(value);
        setError(false);
        setLoading(false);
      });
    }
  }

  const doUpdateList = (evt) => {
    const { value, checked } = evt.target;
    const currentList = pinnedList.slice();
    const currentResults = data.response.results.slice();
    const idx = currentList.findIndex(obj => obj.id === value);
    const itemIdx = currentResults.findIndex(obj => obj.id === value);
    if (checked) {
      if (idx === -1) { //add
        currentList.push(currentResults[itemIdx]);
      }
    } else {
      if (idx !== -1) { //remove
        currentList.splice(idx, 1);
      }
    }
    setPinnedList(currentList);
  }

  const isOnList = (id) => {
      return !!pinnedList.find(item => item.id === id);
  }

  const { response }: Data = data || { response: { status: 'error' } };
  const { results } = response;

  return (
    <div className={styles.container}>
      <Head>
        <title>Portable News App - demo my mikeyc7m</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Portable News App
        </h1>

        <p className={styles.description}>
          demo by mikey7m
        </p>

        <div className="bucket" style={{ textAlign: 'center' }}>
          <form>
            <p>
              <input onChange={(evt) => setInputValue(evt.target.value)} value={inputValue} />
              <button onClick={fetchData} disabled={loading}>{loading ? 'Loading' : !data ? 'Load' : 'Reload'} Data</button>
            </p>
          </form>

          {loading &&
            <p className="message">
              <small>
                Please note there is a fake delay for network latency and also random fake failures.
              </small>
            </p>
          }
          {error && <p className="message bad">Whoops! Something went wrong. Try again?</p>}
          {!loading && !error &&
            (data && <p className="message good">Loaded data successfully.</p>
              || <p>Let&apos;s get started!<br /><small>Enter a search word (or none) and press the button.</small></p>
            )
          }
        </div>

        <div className={styles.grid}>
          {!error && !loading && data && (results && results.length ? results.map((result) => {
            const theDate = new Date(result.webPublicationDate ?? null);
            return <Fragment key={result.id}>
              <a href={result.webUrl} className={styles.card} target="_blank" rel="noreferrer">
                <h2>{result.sectionName}</h2>
                <h6>{(theDate.getDate() + '').padStart(2, '0')}/{((1 + theDate.getMonth()) + '').padStart(2, '0')}/{theDate.getFullYear()}</h6>
                <p>{result.webTitle}</p>
                <label><input type="checkbox" value={result.id} checked={isOnList(result.id)} onChange={doUpdateList} /> Pin this item</label>
              </a>
            </Fragment>
          }) : <p>Nothing matched. Try again?</p>)}
        </div>
      </main>

      <footer className={styles.footer}>
        {pinnedList.map(item => 
          <div key={item.id}>
            <p>{item.webTitle}</p>
            <label><input type="checkbox" value={item.id} checked={true} onChange={doUpdateList} /> Unpin this item</label>
            
          </div>
        )}
      </footer>
    </div>
  );
}
