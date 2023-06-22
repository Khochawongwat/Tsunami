import { useState } from 'react';
import "./SignInPopup.css"
import { UserCredential, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import FireApp from '../../firebase/config';

interface PopupProps {
  active: boolean;
}

const SigninPopup: React.FC<PopupProps> = ({ active }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError('');
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(getAuth(FireApp), email, password);
      const user = userCredential.user;
      console.log('User signed in:', user);
      
      setEmail('');
      setPassword('');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className={`popup ${active ? 'active' : ''}`}>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} required />
          <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} required />
          <button type="submit">Sign In</button>
          {error && <p className="error-message">{error}</p>}

          <button type="submit">Google</button>
          <button type="submit">Facebook</button>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SigninPopup;
