import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "../../css/Modal.css";
import gsap from "gsap";

const Modal = ({ images, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
    );

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <div className="modal-backdrop">
      <div className="modal-content" ref={modalRef}>
        <button className="close-button" onClick={onClose}>
          <span>&times;</span>
        </button>
        <div className="modal-images-container">
          {images.map((image, index) => (
            <img key={index} src={image.url} alt={`Image ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  images: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
