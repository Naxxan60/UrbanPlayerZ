import React, { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import AuthenticationService from '../services/authentication';
import * as firebase from "firebase/app";
import "firebase/auth";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

type Field = {
  value?: any,
  error?: string,
  isValid?: boolean
};

type Form = {
  email: Field,
  password: Field
}
type AuthProps = {
  isAuthed: boolean,
  onAuthChanged(): void
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  btnFacebook: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#3b5998',
  },
  typoOu: {
    margin: theme.spacing(4, 0, 0),
  }
}));

const Login: React.FunctionComponent<AuthProps> = ({ isAuthed, onAuthChanged }: AuthProps) => {
  const classes = useStyles();
  const history = useHistory();

  const [form, setForm] = useState<Form>({
    email: { value: '' },
    password: { value: '' },
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };

    setForm({ ...form, ...newField });
  }

  const validateForm = () => {
    let newForm: Form = form;

    // Validator email
    if (form.email.value.length < 3) {
      const errorMsg: string = 'Votre email doit faire au moins 3 caractères de long.';
      const newField: Field = { value: form.email.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ email: newField } };
    } else {
      const newField: Field = { value: form.email.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ email: newField } };
    }

    // Validator password
    if (form.password.value.length < 6) {
      const errorMsg: string = 'Votre mot de passe doit faire au moins 6 caractères de long.';
      const newField: Field = { value: form.password.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ password: newField } };
    } else {
      const newField: Field = { value: form.password.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ password: newField } };
    }

    setForm(newForm);

    return newForm.email.isValid && newForm.password.isValid;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      AuthenticationService.login(form.email.value, form.password.value).then(result => {
        if (AuthenticationService.GetCurrentUser()) {
          AuthenticationService.SetAuthenticated(true)
          onAuthChanged()
        }
        history.push('/profil');
      }, error => {
        var errorCode = error.code;
        switch (errorCode) {
          case "auth/invalid-email":
            alert('🔐 Adresse mail invalide.');
            break;
          case "auth/user-disabled":
            alert('🔐 utilisateur désactivé.');
            break;
          case "auth/user-not-found":
            alert('🔐 utilisateur introuvable.');
            break;
          case "auth/wrong-password":
            alert('🔐 mauvais mot de passe.');
            break;
          default:
            break;
        }
      });
    }
  }

  const connectToFacebook = () => {
    var firebaseConfig = {
      apiKey: "AIzaSyCUw37XVPKlv7gexsK7WkH57zk3qhRGBO8",
      authDomain: "urbanplayerz-1e042.firebaseapp.com",
      databaseURL: "https://urbanplayerz-1e042.firebaseio.com",
      projectId: "urbanplayerz-1e042",
      storageBucket: "urbanplayerz-1e042.appspot.com",
      messagingSenderId: "914446867811",
      appId: "1:914446867811:web:cdb143086ba3d606374756"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var provider = new firebase.auth.FacebookAuthProvider()
    provider.addScope('user_birthday');
    firebase.auth().signInWithPopup(provider).then(result => {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = result.credential as firebase.auth.OAuthCredential;
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log("result")
      console.log(result)
      console.log("token")
      console.log(token)
      console.log("user")
      console.log(user)
    }).catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log("errorCode")
      console.log(errorCode)
      console.log("errorMessage")
      console.log(errorMessage)
      console.log("email")
      console.log(email)
      console.log("credential")
      console.log(credential)
    });
  }

  return (
    <Container component="main" maxWidth="xs">
      {isAuthed && <Redirect to="/profil"/>}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Connexion
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse mail"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Connexion
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Mot de passe oublié?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Pas de compte? Inscrivez vous"}
              </Link>
            </Grid>
          </Grid>
        </form>
        <Typography component="h2" variant="h5" className={classes.typoOu}>
          Ou
        </Typography>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.btnFacebook}
        >
          Connexion par Facebook
        </Button>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Login;