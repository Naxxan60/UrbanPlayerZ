import React, { FunctionComponent, useState, useEffect } from 'react';
import User from '../models/user';
import AuthentificationService from '../services/authentication';
import Player from '../models/player';
import PlayerService from '../services/player.service';

import { Container, TextField, Button, Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
  

type Field = {
  value?: any,
  error?: string,
  isValid?: boolean
};

type Form = {
  id: Field;
  firstname: Field;
  lastname: Field;
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

const Profil: FunctionComponent = () => {

  const classes = useStyles();
  const history = useHistory();

  const [form, setForm] = useState<Form>({
    id: { value: '' },
    firstname: { value: '' },
    lastname: { value: '' },
  });

  const [user, setUser] = useState<User | null>(AuthentificationService.GetCurrentUser());
  
  const [player, setPlayer] = useState<Player>(new Player("","",""));

  useEffect(() => {
    async function loadPlayer(){
      PlayerService.GetCurrentPlayer().then((document)=>{
        let pl = PlayerService.TreatGetCurrentPlayer(document)
        setPlayer(prevState => {
          return { ...prevState, ...player }
        })
        setForm({
          id: { value: pl?.id ? pl?.id : '' },
          firstname: { value: pl?.firstname ? pl?.firstname : '' },
          lastname: { value: pl?.lastname ? pl?.lastname : ''  },
        })
        console.log(player)
      })
    }
    loadPlayer();
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };

    setForm({ ...form, ...newField });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("not done")
  }

  return (
    <Container component="main" maxWidth="xs">
      <h1 className="center">Profil</h1>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstname"
            label="firstname"
            name="firstname"
            autoFocus
            onChange={handleInputChange}
            value={form.firstname.value}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastname"
            name="lastname"
            label="lastname"
            onChange={handleInputChange}
            value={form.lastname.value}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Modifier
          </Button>
        </form>
    </Container>
  );
}
  
export default Profil;