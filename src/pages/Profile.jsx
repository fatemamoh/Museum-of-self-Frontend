import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import * as userService from '../services/userService';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setUser(data);
        setFormData({
          bio: data.bio || '',
          location: data.location || '',
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (localStorage.getItem('token')) fetchProfile();
  }, [setUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('bio', formData.bio);
      data.append('location', formData.location);
      if (photo) data.append('avatar', photo);

      const updatedUser = await userService.updateProfile(data);
      
      setUser(updatedUser);
      setPhoto(null);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await userService.deleteProfile();
      localStorage.removeItem('token');
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <main>
      <section>
        {!isEditing ? (
          <div>
            <span>Exhibit 01: Curator</span>
            <h1>{user.username}</h1>
            <div>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Portrait" style={{ width: '200px' }} />
              ) : (
                <div>No Portrait</div>
              )}
            </div>
            <p>{user.bio || "No narrative description."}</p>
            <p>Location: {user.location || "Unspecified"}</p>
            <button onClick={() => setIsEditing(true)}>MODIFY PROFILE</button>
          </div>
        ) : (
          <div>
            <h2>Modify Profile</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="avatar">Portrait File</label>
              <input type="file" id="avatar" name="avatar" onChange={handleFileChange} />
              
              <label htmlFor="location">Location</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
              
              <label htmlFor="bio">Narrative</label>
              <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />
              
              <button type="submit">UPDATE CHANGES</button>
              <button type="button" onClick={() => setIsEditing(false)}>CANCEL</button>
            </form>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          {!isDeleting ? (
            <button onClick={() => setIsDeleting(true)}>Request Record Destruction</button>
          ) : (
            <div>
              <p>Confirm Erasure?</p>
              <button onClick={handleDelete}>YES, ERASE</button>
              <button onClick={() => setIsDeleting(false)}>NO, RETURN</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Profile;