import React, { FunctionComponent, useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import PageNotFound from './pages/page-not-found';
import PokemonList from './pages/pokemon-list';
import Login from './pages/login';
import SignUp from './pages/signup';
import AuthentificationService from './services/authentication';
import Profil from './pages/profil';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { LinearProgress, CssBaseline } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         flexGrow: 1,
      },
      menuButton: {
         marginRight: theme.spacing(2),
      },
      title: {
         flexGrow: 1,
      },
   }),
);

const App: FunctionComponent = () => {

   const classes = useStyles();
   const [isAuthenticated, setAuth] = React.useState<boolean>(false);
   const [isLoading, setIsLoading] = React.useState<boolean>(true);

   useEffect(() => {
      async function InitAuthentification() {
         await AuthentificationService.InitAuthentification()
         setAuth(AuthentificationService.isAuthenticated)
         setIsLoading(false)
      }
      InitAuthentification()
   }, [])


   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);

   const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      console.log(isAuthenticated)
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      console.log(isAuthenticated)
      setAnchorEl(null);
   };

   const handleLogout = () => {
      console.log("isAuthenticated")
      console.log(isAuthenticated)
      console.log("AuthenticationService.isAuthenticated")
      console.log(AuthentificationService.isAuthenticated)
      console.log("AuthenticationService.GetCurrentUser()")
      console.log(AuthentificationService.GetCurrentUser())
      setAnchorEl(null);
      AuthentificationService.LogOut().then(function() {
         AuthentificationService.SetAuthenticated(false)
         setAuth(false)
      }).catch(function(error) {
        alert("erreur sur la déconnexion")
      });
   };

   const testAuth = () => {
      console.log("isAuthenticated")
      console.log(isAuthenticated)
      console.log("AuthenticationService.isAuthenticated")
      console.log(AuthentificationService.isAuthenticated)
      console.log("AuthenticationService.GetCurrentUser()")
      console.log(AuthentificationService.GetCurrentUser())
   };

   const onAuthChanged = () => {
      setAuth(AuthentificationService.isAuthenticated)
   };

   return (
      <Router>
         <CssBaseline />
         <div>
            {/* bar de nav*/}
            <AppBar position="static">
               <Toolbar>
                  <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={testAuth}>
                     <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>
                     Urban Player Z
                  </Typography>
                  {isAuthenticated ?
                     <div>
                        <IconButton
                           aria-label="account of current user"
                           aria-controls="menu-appbar"
                           aria-haspopup="true"
                           onClick={handleMenu}
                           color="inherit"
                        >
                           <AccountCircle />
                        </IconButton>
                        <Menu
                           id="menu-appbar"
                           anchorEl={anchorEl}
                           anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                           }}
                           keepMounted
                           transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                           }}
                           open={open}
                           onClose={handleClose}
                        >
                           <MenuItem onClick={handleClose}>Profil</MenuItem>
                           <MenuItem onClick={handleClose}>Mon compte</MenuItem>
                           <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                        </Menu>
                     </div>
                     :
                     <div>
                        <Button color="inherit" href="/login">Connexion</Button>
                        <Button color="inherit" href="/signup">S'inscrire</Button>
                     </div>
                  }
               </Toolbar>
            </AppBar>
            {/* systeme de gestion des routes*/}
            {isLoading ?
               <LinearProgress />
               :
               <Switch>
                  <PrivateRoute exact path="/" component={PokemonList}></PrivateRoute>
                  <Route exact path="/login" render={(props) => <Login {...props} isAuthed={isAuthenticated} onAuthChanged={onAuthChanged} />}></Route>
                  <Route exact path="/signup" render={(props) => <SignUp {...props} isAuthed={isAuthenticated} onAuthChanged={onAuthChanged} />}></Route>
                  <PrivateRoute exact path="/profil" component={Profil}></PrivateRoute>
                  <PrivateRoute exact path="/pokemons" component={PokemonList}></PrivateRoute>
                  <Route component={PageNotFound}></Route>
               </Switch>
            }
         </div>
      </Router>
   )
}

export default App;