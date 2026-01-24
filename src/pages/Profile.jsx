import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import * as userService from '../services/userService'

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
  }, []);

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
      <div>
        {!isEditing ? (
          <div>
            <div>
              <span>Exhibit 01: Curator</span>
              <h1>{user.username}</h1>
              <div></div>
              <div>
                <div>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Portrait" />
                  ) : (
                    <div>Empty</div>
                  )}
                </div>
              </div>
              <p>{user.bio || "This record currently contains no narrative description."}</p>
              <div>
                <div>
                  <p>Located At</p>
                  <p>{user.location || "Unspecified"}</p>
                </div>
                <button onClick={() => setIsEditing(true)}>MODIFY PROFILE</button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2>Modify Profile</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="avatar">Portrait File</label>
                <input 
                  type="file" 
                  id="avatar" 
                  name="avatar" 
                  onChange={handleFileChange} 
                />
              </div>
              <div>
                <label htmlFor="location">Current Location</label>
                <input 
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location} 
                  placeholder="e.g. BAHRAIN, BH "
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="bio">Curator's Narrative</label>
                <textarea 
                  id="bio"
                  name="bio"
                  value={formData.bio} 
                  placeholder="Tell your story..."
                  onChange={handleChange} 
                />
              </div>
              <div>
                <button type="submit">UPDATE CHANGES</button>
                <button type="button" onClick={() => setIsEditing(false)}>CANCEL</button>
              </div>
            </form>
          </div>
        )}

        <div>
          <div />
          {!isDeleting ? (
            <button onClick={() => setIsDeleting(true)}>Request Record Destruction</button>
          ) : (
            <div>
              <span>Critical Warning: Permanent Erasure</span>
              <div>
                <button onClick={handleDelete}>YES, ERASE</button>
                <button onClick={() => setIsDeleting(false)}>NO, RETURN</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;