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

export function App(props) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState([]);
  const [status, setStatus] = useState(props.idle);

  useEffect(() => {
    async function fetchTestData(_, prevState) {
      try {
        const prevPage = prevState.page;
        const currentPage = page;
        const prevQuery = prevState.query;
        const currentQuery = query;

        if (prevPage !== currentPage || prevQuery !== currentQuery) {
          setStatus(props.pending);
          const data = await fetchImages(currentQuery, currentPage);
          const { hits, total } = data;

          if (total === 0 || (hits.length === 0 && hits.totalHits > 0)) {
            setStatus(props.idle);
            return;
          }
          setStatus(props.resolved);
          setHits(prevState => ({
            hits: [...prevState.hits, ...hits],
          }));
          return;
        }
      } catch (error) {
        console.log(error);
        setStatus(props.rejected);
      }
    }

    fetchTestData();
  }, []);

  const formSubmit = query => {
    setQuery(query);
    setPage(1);
    setHits([]);
    setStatus(props.idle);
  };

  const loadMoreClick = () => {
    setPage(prevState => ({
      page: prevState.page + 1,
    }));
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

// Код що працює (на класах)
// import { Component } from 'react';
// import { Box } from './Box';
// import { GlobalStyle } from './GlobalStyle';
// import { fetchImages } from 'services/api';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import Searchbar from './SearchBar/Searchbar';
// import ImageGallery from './ImageGallery/ImageGallery';
// import Button from './Button/Button';
// import Loader from './Loader/Loader';

// export class App extends Component {
//   state = {
//     page: 1,
//     query: '',
//     hits: [],
//     status: 'idle',
//   };

//   async componentDidUpdate(_, prevState) {
//     try {
//       const prevPage = prevState.page;
//       const currentPage = this.state.page;
//       const prevQuery = prevState.query;
//       const currentQuery = this.state.query;

//       if (prevPage !== currentPage || prevQuery !== currentQuery) {
//         this.setState({ status: 'pending' });
//         const data = await fetchImages(currentQuery, currentPage);
//         const { hits, total } = data;

//         if (total === 0 || (hits.length === 0 && hits.totalHits > 0)) {
//           this.setState({ status: 'idle' });
//           return;
//         }
//         this.setState({ status: 'resolved' });
//         this.setState(prevState => ({
//           hits: [...prevState.hits, ...hits],
//         }));
//         return;
//       }
//     } catch (error) {
//       console.log(error);
//       this.setState({ status: 'rejected' });
//     }
//   }

//   formSubmit = query => {
//     this.setState({
//       page: 1,
//       query: query,
//       hits: [],
//       status: 'idle',
//     });
//   };

//   loadMoreClick = () => {
//     this.setState(prevState => ({
//       page: prevState.page + 1,
//     }));
//     setTimeout(() => {
//       window.scrollTo({
//         top: document.documentElement.scrollHeight,
//         behavior: 'smooth',
//       });
//     }, 1000);
//   };

//   render() {
//     const { hits, status } = this.state;
//     return (
//       <Box display="grid" gridTemplateColumns="1fr" gridGap="16px" pb="24px">
//         <Searchbar onSubmit={this.formSubmit} />
//         {hits.length > 0 && <ImageGallery hits={hits} />}
//         {status === 'pending' && <Loader />}
//         {status === 'resolved' &&
//           hits.length % 12 === 0 &&
//           hits.length !== 0 && <Button onClick={this.loadMoreClick} />}

//         <GlobalStyle />
//         <ToastContainer
//           autoClose={2000}
//           position="bottom-center"
//           closeOnClick
//           theme={'colored'}
//         />
//       </Box>
//     );
//   }
// }
