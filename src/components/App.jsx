import { useState, useEffect } from 'react';
import { Box } from './Box';
import { GlobalStyle } from './GlobalStyle';
import { fetchImages } from 'services/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './SearchBar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';

export function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!query) {
      return;
    }
    async function fetchData() {
      try {
        setStatus('pending');
        const data = await fetchImages(query, page);
        const { hits, total } = data;
        if (total === 0 || (hits.length === 0 && hits.totalHits > 0)) {
          setStatus('idle');
          return;
        }
        setStatus('resolved');
        setHits(prevHits => [...prevHits, ...hits]);
        return;
      } catch (error) {
        console.log(error);
        setStatus('rejected');
      }
    }
    fetchData();
  }, [page, query]);

  const formSubmit = query => {
    setQuery(query);
    setPage(1);
    setHits([]);
    setStatus('idle');
  };

  const loadMoreClick = () => {
    setPage(prevPage => prevPage + 1);
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 1000);
  };

  return (
    <Box display="grid" gridTemplateColumns="1fr" gridGap="16px" pb="24px">
      <Searchbar onSubmit={formSubmit} />
      {hits.length > 0 && <ImageGallery hits={hits} />}
      {status === 'pending' && <Loader />}
      {status === 'resolved' && hits.length % 12 === 0 && hits.length !== 0 && (
        <Button onClick={loadMoreClick} />
      )}

      <GlobalStyle />
      <ToastContainer
        autoClose={2000}
        position="bottom-center"
        closeOnClick
        theme={'colored'}
      />
    </Box>
  );
}
