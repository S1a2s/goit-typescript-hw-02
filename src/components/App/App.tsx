import { useState } from "react";
import { Photo, getPhotos } from "../../apiService/images";
import SearchBar from "../SearchBar/SearchBar";
import { useEffect } from "react";
import ImageGallery from "../ImageGallery/ImageGallery";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast from "react-hot-toast";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";
import ImageModal from "../ImageModal/ImageModal";
import "./App.css";

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [images, setImages] = useState<Photo[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalUrl, setModalUrl] = useState<string>("");
  const [modalAlt, setModalAlt] = useState<string>("");

  useEffect(() => {
    if (!query) return;
    const fatchData = async () => {
      setIsLoading(true);
      try {
        const { results, total_pages } = await getPhotos(query, page);
        setImages((prevState) => [...prevState, ...results]);
        setIsVisible(page !== total_pages && total_pages !== 0);
        if (results.length === 0) {
          toast("There is nothing found", {
            style: {
              border: "1px solid #713200",
              padding: "16px",
              color: "#713200",
            },
            iconTheme: {
              primary: "#713200",
              secondary: "#FFFAEE",
            },
          });
        }
      } catch (error) {
        setError(true);
        toast.error("Oops, something went wrong, please try again later", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fatchData();
  }, [page, query]);

  const handleSubmit = (value: string): void => {
    if (query === value) {
      toast(`You have already got the result by request '${value}'`, {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
      return;
    }
    setQuery(value);
    setImages([]);
    setPage(1);
    setError(false);
    setIsVisible(false);
  };

  const loadMore = (): void => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleOpenModal = (url: string, alt: string): void => {
    setShowModal(true);
    setModalUrl(url);
    setModalAlt(alt);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setModalUrl("");
    setModalAlt("");
  };

  return (
    <div className="container">
      <SearchBar onSubmit={handleSubmit} />
      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      <ImageGallery results={images} onModalOpen={handleOpenModal} />
      {isVisible && <LoadMoreBtn onClick={loadMore} />}
      <ImageModal
        modalIsOpen={showModal}
        closeModal={handleCloseModal}
        src={modalUrl}
        alt={modalAlt}
      />
    </div>
  );
};

export default App;