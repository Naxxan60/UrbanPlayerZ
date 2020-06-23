import React, { FunctionComponent, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import AuthenticationService from '../services/authentication';

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
import { CircularProgress } from '@material-ui/core';
import Player from '../models/player';
import PlayerService from '../services/player.service';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>
            {' '}{new Date().getFullYear()}{'.'}
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
    lastname: Field,
    firstname: Field,
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    CircularProgress: {
        alignContent: "center",
    }
}));

const SignUp: FunctionComponent<AuthProps> = ({ isAuthed, onAuthChanged }: AuthProps) => {

    const classes = useStyles();
    const history = useHistory();

    const [form, setForm] = useState<Form>({
        email: { value: '' },
        lastname: { value: '' },
        firstname: { value: '' },
        password: { value: '' },
    });

    const [loading, setLoading] = useState<boolean>(false);

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

        // Validator lastname
        if (form.lastname.value.length < 2) {
            const errorMsg: string = 'Votre nom doit faire au moins 2 caractères de long.';
            const newField: Field = { value: form.lastname.value, error: errorMsg, isValid: false };
            newForm = { ...newForm, ...{ lastname: newField } };
        } else {
            const newField: Field = { value: form.lastname.value, error: '', isValid: true };
            newForm = { ...newForm, ...{ lastname: newField } };
        }

        // Validator firstname
        if (form.firstname.value.length < 2) {
            const errorMsg: string = 'Votre prénom doit faire au moins 2 caractères de long.';
            const newField: Field = { value: form.firstname.value, error: errorMsg, isValid: false };
            newForm = { ...newForm, ...{ firstname: newField } };
        } else {
            const newField: Field = { value: form.firstname.value, error: '', isValid: true };
            newForm = { ...newForm, ...{ firstname: newField } };
        }

        // Validator password
        if (form.password.value.length < 3) {
            const errorMsg: string = 'Votre mot de passe doit faire au moins 6 caractères de long.';
            const newField: Field = { value: form.password.value, error: errorMsg, isValid: false };
            newForm = { ...newForm, ...{ password: newField } };
        } else {
            const newField: Field = { value: form.password.value, error: '', isValid: true };
            newForm = { ...newForm, ...{ password: newField } };
        }

        setForm(newForm);

        return newForm.email.isValid && newForm.firstname.isValid && newForm.lastname.isValid && newForm.password.isValid;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const isFormValid = validateForm();
        if (isFormValid) {
            AuthenticationService.CreateAccount(form.email.value, form.firstname.value, form.lastname.value, form.password.value).then(() => {
                const user = AuthenticationService.GetCurrentUser()
                if (user) {
                    let newPlayer = new Player(user!.id, form.firstname.value, form.lastname.value);
                    PlayerService.$CheckIfPlayerExist(newPlayer.id).then((document) => {
                        if (document.exists) {
                            return
                        } else {
                            PlayerService.$CreatePlayer(newPlayer)
                                .then(() => {
                                    AuthenticationService.SetAuthenticated(true)
                                    onAuthChanged()
                                    history.push('/profil');
                                })
                                .catch(function (error) {
                                    console.error("Error creating player: ", error);
                                });
                        }
                    })
                }
            }, error => {
                var errorCode = error.code;
                switch (errorCode) {
                    case "auth/email-already-in-use":
                        alert('🔐 Adresse mail déjà utilisé.');
                        break;
                    case "auth/invalid-email":
                        alert('🔐 Adresse email invalide.');
                        break;
                    case "auth/operation-not-allowed":
                        alert('🔐 Opération non possible pour le moment.');
                        break;
                    case "auth/weak-password":
                        alert('🔐 Le mot de passe doit faire 6 caractères minimum.');
                        break;
                    default:
                        break;
                }
            });
        } else {
            alert('non valid');
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            {isAuthed && <Redirect to="/profil" />}
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Inscription
            </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstname"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstname"
                                label="Prénom"
                                autoFocus
                                value={form.firstname.value}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastname"
                                label="Nom"
                                name="lastname"
                                autoComplete="lname"
                                value={form.lastname.value}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Adresse email"
                                name="email"
                                autoComplete="email"
                                value={form.email.value}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Mot de passe"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={form.password.value}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    {loading &&
                        <Grid item xs={12}>
                            <CircularProgress
                                className={classes.CircularProgress} />
                        </Grid>
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        S'inscrire
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Déjà un compte? Connexion
                        </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>

    );
};

export default SignUp;