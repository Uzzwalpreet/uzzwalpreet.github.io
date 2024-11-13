import React, { useEffect, useState } from 'react';
import NoRecordDb from './NoRecordDB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

interface FavoriteData {
  _id: string;
  data: any;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

interface FavoritesProps {
  fetchWeatherDataForFavorite: (latitude: number, longitude: number, city: string, state: string) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ fetchWeatherDataForFavorite }) => {
  const [favoritesData, setFavoritesData] = useState<FavoriteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/favorites');
        const data: FavoriteData[] = await response.json();
        setFavoritesData(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRowClick = (item: FavoriteData) => {
    fetchWeatherDataForFavorite(item.latitude, item.longitude, item.city, item.state);
  };

  const handleDelete = async (id: string) => {
    console.log("Handle Delete Favorites")
    try {
      const response = await fetch(`http://localhost:5001/api/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFavoritesData(favoritesData.filter((item) => item._id !== id));
        console.log("Deleted item:", id);
      } else {
        console.error("Failed to delete item:", id);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : favoritesData.length === 0 ? (
        <NoRecordDb />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>City</th>
              <th>State</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {favoritesData.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRowClick(item);
                    }}
                  >
                    {item.city}
                  </a>
                </td>
                <td>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRowClick(item);
                    }}
                  >
                    {item.state}
                  </a>
                </td>
                <td>
                  <button className="btn" onClick={() => handleDelete(item._id)}>
                    <FontAwesomeIcon icon={faTrashCan} color="black" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Favorites;