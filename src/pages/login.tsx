import React, { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import AuthenticationService from '../services/authentication';
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
import PlayerService from '../services/player.service';
import ProfilInfo from '../models/ProfilInfo';
import Player from '../models/player';

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

    AuthenticationService.ConnectToFacebook().then(result => {
      var user = result.user;
      if (!result.additionalUserInfo) {
        alert("Impossible de récuperer les infos")
        return
      }
      let profilInfo = result.additionalUserInfo!.profile as ProfilInfo
      let age;
      let photo;
      if (profilInfo.birthday) {
        age = PlayerService.calculate_age(new Date(profilInfo.birthday));
      }
      if (profilInfo.picture?.data?.url) {
        photo = profilInfo.picture?.data?.url
      }
      let newPlayer = new Player(user!.uid, profilInfo.first_name, profilInfo.last_name, age, null, photo);
      PlayerService.$CheckIfPlayerExist(newPlayer.id).then((document) => {
        if (document.exists) {
          AuthenticationService.SetAuthenticated(true)
          onAuthChanged()
          history.push("/profil")
        } else {
          PlayerService.$CreatePlayer(newPlayer)
            .then(() => {
              AuthenticationService.SetAuthenticated(true)
              onAuthChanged()
              history.push("/profil")
            })
            .catch(function (error) {
              console.error("Error creating player: ", error);
            });
        }
      })
    }).catch(error => {
      var errorCode = error.code;
      switch (errorCode) {
        case "auth/account-exists-with-different-credential":
          alert('🔐 Adresse mail déjà utilisé avec un compte par mot de passe.');
          break;
        case "auth/auth-domain-config-required":
          alert('🔐 problème de configuration.');
          break;
        case "auth/cancelled-popup-request":
          alert('🔐 Thrown if successive popup operations are triggered. Only one popup request is allowed at one time. All the popups would fail with this error except for the last one.');
          break;
        case "auth/operation-not-allowed":
          alert('🔐 Thrown if the type of account corresponding to the credential is not enabled.');
          break;
        case "auth/operation-not-supported-in-this-environment":
          alert('🔐 Thrown if this operation is not supported in the environment your application is running on. "location.protocol" must be http or https.');
          break;
        case "auth/popup-blocked":
          alert('🔐 Thrown if the popup was blocked by the browser, typically when this operation is triggered outside of a click handler.');
          break;
        case "auth/unauthorized-domain":
          alert('🔐 Thrown if the type of account corresponding to the credential is not enabled.');
          break;
        case "auth/operation-not-allowed":
          alert('🔐 Thrown if the type of account corresponding to the credential is not enabled.');
          break;
        case "auth/operation-not-allowed":
          alert('🔐 Thrown if the app domain is not authorized.');
          break;
        default:
          break;
      }
    });
  }

  return (
    <Container component="main" maxWidth="xs">
      {isAuthed && <Redirect to="/profil" />}
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
          onClick={connectToFacebook}
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