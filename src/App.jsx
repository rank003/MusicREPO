import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedTracks from './pages/SavedTracks';
import MusicSearch from './pages/MusicSearch';
import SpotifySearch from './pages/spotifySearch';
import Admin from './pages/Admin'

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/search" component={MusicSearch} />
        <Route path="/saved" component={SavedTracks} />
        <Route path="/SpotifySearch" component={SpotifySearch} />
        <Route path="/Adminsaved" component={Admin} />
      </Switch>
    </Router>
  );
}

export default App;
