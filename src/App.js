import './App.css';
import { useSelector} from 'react-redux';

import Main from './Main';
import { getIsLoggedIn } from './redux/userSlice';
import AuthScreen from './pages/auth/AuthScreen';


function App() {
  const isloggedIn = useSelector(getIsLoggedIn);

  return (
    <div className="App">
      
      {isloggedIn ? (<Main/>) : (<AuthScreen/>)}
       
    </div>
  );
}

export default App;

