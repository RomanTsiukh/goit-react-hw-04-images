import PropTypes from 'prop-types';
import Modal from 'components/Modal/Modal';
import { ImageItem, ImageItemCard } from './ImageGalleryItem.styled';
import { useState } from 'react';

export default function ImageGalleryItem(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ImageItem>
      <ImageItemCard
        src={props.hit.webformatURL}
        alt={props.hit.tags}
        onClick={openModal}
      />
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <img src={props.hit.largeImageURL} alt={props.hit.tags} />
        </Modal>
      )}
    </ImageItem>
  );
}

ImageGalleryItem.propTypes = {
  hits: PropTypes.array,
  isModal: PropTypes.bool,
};
