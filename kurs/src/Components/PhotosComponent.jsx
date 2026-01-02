import React  from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";


const PhotosComponent = () => {
    

    const [selectedFile, setSelectedFile] = useState(null);
    const [category, setCategory] = useState("Z życia Koinonii");
    const [photos, setPhotos] = useState([]);
    const navigate = useNavigate();

    // Pobieranie zdjęć dla wybranej kategorii
  const fetchPhotos = async () => {
    try {
        const response = await axios.get(`http://localhost:8099/api/gallery/photos`, {
            params: { category: category }, // To bezpieczniejszy sposób przekazywania parametrów ze spacjami
            withCredentials: true           // OBOWIĄZKOWE przy użyciu Spring Security + Session
        });
        setPhotos(response.data);
    } catch (error) {
        console.error("Błąd pobierania:", error);
    }
};


    useEffect(() => { fetchPhotos(); }, [category]);


    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("category", category);

        await axios.post("http://localhost:8099/api/gallery/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
        });
        fetchPhotos();
    };

   const deletePhoto = (id) =>
     { const ok = window.confirm("Czy na pewno chcesz usunąć to zdjęcie?"); 
        if (!ok) { return;

        } axios.delete(`http://localhost:8099/api/gallery/photos/${id}`,
             { withCredentials: true })
              .then(() => setPhotos(photos.filter(p => p.id !== id))); 
    };



    return (
        <div className="gallery-container">
            <h2>Galeria</h2>
            
            <div className="upload-section">
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Z życia Koinonii">Z życia Koinonii</option>
                    <option value="Inne">Inne</option>
                </select>
                <button onClick={handleUpload}>Dodaj zdjęcie</button>
                <button type="button" onClick={() => navigate('/member')}>Menu główne</button>
            </div>

            <div className="category-tabs">
                <button onClick={() => setCategory("Z życia Koinonii")}>Z życia Koinonii</button>
                <button onClick={() => setCategory("Inne")}>Inne</button>
            </div>

            <div className="photo-grid">
                {photos.map(p => (
                    <div key={p.id} className="photo-item">
                        {/* URL musi wskazywać na endpoint serwujący pliki */}
                        <img src={`http://localhost:8099/api/gallery/files/${p.fileName}`} alt="gallery" />
                         <button className="delete-photo-btn" onClick={() => deletePhoto(p.id)}
      >
        🗑️
      </button>
                    </div>
                ))}
            </div>
        </div>
    );


}
export default PhotosComponent;

