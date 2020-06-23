import React, { FunctionComponent, useState, useEffect } from 'react';
import User from '../models/user';
import AuthentificationService from '../services/authentication';
import Player from '../models/player';
import PlayerService from '../services/player.service';

import { Container, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Image from 'material-ui-image';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { COUNTRIES, CountryType } from "../helper/countries"
import { FieldPositionsType, FIELDPOSITIONS } from '../helper/fieldPositions';
import { useSnackbar } from 'notistack';
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
  age: Field;
  height: Field;
  photo: Field;
  strongFoot: Field;
  fieldPositions: Field;
  countries: Field;
}

const useStyles = makeStyles((theme) => ({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
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

  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();
  const history = useHistory();
  const [availableCountries] = useState(COUNTRIES);
  const [availableFieldPositions] = useState(FIELDPOSITIONS);

  const [form, setForm] = useState<Form>({
    id: { value: '' },
    firstname: { value: '' },
    lastname: { value: '' },
    age: { value: '' },
    height: { value: '' },
    photo: { value: '' },
    strongFoot: { value: '' },
    fieldPositions: { value: [] },
    countries: { value: [] },
  });

  const [user] = useState<User | null>(AuthentificationService.GetCurrentUser());

  useEffect(() => {
    async function loadPlayer() {
      PlayerService.GetCurrentPlayer().then((document) => {
        let pl = PlayerService.TreatGetCurrentPlayer(document)
        setForm({
          id: { value: pl?.id ? pl?.id : '' },
          firstname: { value: pl?.firstname ? pl?.firstname : '' },
          lastname: { value: pl?.lastname ? pl?.lastname : '' },
          age: { value: pl?.age ? pl?.age : '' },
          height: { value: pl?.height ? pl?.height : '' },
          photo: { value: pl?.photo ? pl?.photo : '' },
          strongFoot: { value: pl?.strongFoot ? pl?.strongFoot : '' },
          fieldPositions: { value: pl?.fieldPositions ? pl?.fieldPositions : '' },
          countries: { value: pl?.countries ? pl?.countries : '' },
        })
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
  const handleStrongFeetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const fieldName: string = "strongFoot";
    const newField: Field = { [fieldName]: { value: event.target.value as string } };
    setForm({ ...form, ...newField });
  };
  const handleCountriesChange = (event: any, newValue: any) => {
    const fieldName: string = "countries";
    const newField: Field = { [fieldName]: { value: newValue } };
    setForm({
      ...form,
      ...newField
    });
  };

  const handleFieldPositionsChange = (event: any, newValue: any) => {
    const fieldName: string = "fieldPositions";
    const newField: Field = { [fieldName]: { value: newValue } };
    setForm({
      ...form,
      ...newField
    });
  };

   const handleInterviewClick = () => {
      history.push("/interview")
   };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedPlayer = new Player(user!.id,
      form.firstname.value,
      form.lastname.value,
      form.age.value,
      form.height.value,
      form.photo.value,
      form.strongFoot.value,
      form.fieldPositions.value,
      form.countries.value)
    PlayerService.$UpdatePlayer(updatedPlayer).then(() => {
      enqueueSnackbar('Modification enregistré', { variant: "success" });
    }).catch(function (error) {
      enqueueSnackbar("Problème d'enregistrement", { variant: "error" })
      console.error("Error creating player: ", error);
    });
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
          label="Prénom"
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
          label="Nom"
          onChange={handleInputChange}
          value={form.lastname.value}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="age"
          name="age"
          label="Age"
          onChange={handleInputChange}
          value={form.age.value}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="height"
          name="height"
          label="Taile"
          onChange={handleInputChange}
          value={form.height.value}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="photo"
          name="photo"
          label="photo"
          onChange={handleInputChange}
          value={form.photo.value}
        />
        <Box width="100px" >
          <Image src={form.photo.value? form.photo.value : "http://"} imageStyle={{ width: '100px', height: '100px' }}></Image>
        </Box>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel id="strongFootLabel">Pied fort</InputLabel>
          <Select
            labelId="strongFootLabel"
            label="Pied fort"
            id="strongFoot"
            value={form.strongFoot.value}
            onChange={handleStrongFeetChange}
          >
            <MenuItem value={0}>Droit</MenuItem>
            <MenuItem value={1}>Gauche</MenuItem>
            <MenuItem value={2}>Ambidextre</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal">
          <Autocomplete
            multiple
            id="country-select"
            options={availableCountries as CountryType[]}
            classes={{
              option: classes.option,
            }}
            autoHighlight
            value={form.countries.value}
            onChange={handleCountriesChange}
            getOptionLabel={(option) => option.label}
            renderOption={(option) => (
              <React.Fragment>
                <span>{option.code}</span>
                {option.label}
              </React.Fragment>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choisissez deux pays maximum"
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
              />
            )}
          />
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal">
          <Autocomplete
            multiple
            id="fieldpos-select"
            options={availableFieldPositions as FieldPositionsType[]}
            classes={{
              option: classes.option,
            }}
            autoHighlight
            value={form.fieldPositions.value}
            onChange={handleFieldPositionsChange}
            getOptionLabel={(option) => option.code}
            renderOption={(option) => (
              <React.Fragment>
                <span>{option.code}</span>
              </React.Fragment>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choisissez trois positions maximum"
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
              />
            )}
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Modifier
          </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
          onClick={handleInterviewClick}
        >
          Remplir l'interview
          </Button>
      </form>
    </Container>
  );
}

export default Profil;