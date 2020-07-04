import React, { FunctionComponent, useState, useEffect } from 'react';
import User from '../models/user';
import AuthentificationService from '../services/authentication';

import { Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, IconButton, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSnackbar } from 'notistack';
import { QUESTIONSINTERVIEW, AnswersInterviewType } from '../helper/questions-interview';
import InterviewService from '../services/interview.service';

type Form = {
  answers: AnswersInterviewType[];
}

const useStyles = makeStyles((theme) => ({
  answers: {
    '& input': {
      height: '2em',
    },
  },
  root: {
    marginTop: '5px',
    alignItems: 'center',
  },
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

const Interview: FunctionComponent = () => {

  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();
  const [availableQuestions] = useState(QUESTIONSINTERVIEW);

  const [form, setForm] = useState<Form>({
    answers: [],
  });

  const [user] = useState<User>(AuthentificationService.GetCurrentUser());

  useEffect(() => {
    async function loadInterview() {
      InterviewService.$GetInterviewOf(user.id).then((document) => {
        let lol = new Array<AnswersInterviewType>();
        let interv = InterviewService.TreatGetInterviewOf(document)
        setForm({
          answers: interv ? interv : []
        })
      })
    }
    loadInterview();
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    InterviewService.$CheckIfInterviewExist(user!.id).then((document) => {
      if (document.exists) {
        InterviewService.$DeleteInterview(user!.id).then(() => {
          InterviewService.$CreateInterview(user!.id, form.answers)
            .then(() => {
              enqueueSnackbar('Modification enregistré', { variant: "success" });
            })
            .catch(function (error) {
              enqueueSnackbar("Problème d'enregistrement", { variant: "error" })
              console.error("Error creating after deleting interview: ", error);
            });
        }).catch(function (error) {
          enqueueSnackbar("Problème d'enregistrement", { variant: "error" })
          console.error("Error deleting interview: ", error);
        });
      } else {
        InterviewService.$CreateInterview(user!.id, form.answers)
          .then(() => {
            enqueueSnackbar('Modification enregistré', { variant: "success" });
          })
          .catch(function (error) {
            enqueueSnackbar("Problème d'enregistrement", { variant: "error" })
            console.error("Error creating interview: ", error);
          });
      }
    }).then(() => {
    }).catch(function (error) {
      enqueueSnackbar("Problème d'enregistrement", { variant: "error" })
      console.error("Error checking interview: ", error);
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newCode: string = e.target.name;
    const newAnswer: string = e.target.value;
    const refAnswer = form.answers.find(i => i.code === newCode)
    if (!refAnswer) {
      return
    }
    refAnswer.answer = newAnswer
    setForm({ ...form, ...form });
  }

  const handleDeleteAnswer = (code: string): void => {
    form.answers = form.answers.filter(ans => ans.code != code)
    setForm({ ...form, ...form });
  }

  const handleAddNewQuestion = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newField = { code: event.target.value, answer: "" } as AnswersInterviewType;
    form.answers.push(newField)
    setForm({ ...form, ...form });
  }

  return (
    <Container component="main" maxWidth="xs">
      <h1 className="center">Interview</h1>
      <form className={classes.form} onSubmit={handleSubmit}>

        <FormControl fullWidth margin="normal">
          <label id="questionsLabel"><span style={{ fontWeight: 'bold' }}>Ajouter une nouvelle question à ton interview :</span></label>
          <Select
            id="questions"
            onChange={handleAddNewQuestion}
            value="000"
          >
            <MenuItem key="000" value="000" disabled>
              Sélectionne la question
            </MenuItem>
            {availableQuestions.map(({ code, question }) => (
              <MenuItem key={code} value={code} disabled={form.answers.find(i => i.code === code) ? true : false}>
                {question}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {form.answers.map(({ code, answer }, index) => (
          <Grid container spacing={2} className={classes.root} key={code}>
            <Grid item xs>
              <TextField
                margin="normal"
                fullWidth
                id={"question_" + code}
                name={code}
                label={availableQuestions.find(i => i.code === code)?.question}
                onChange={handleInputChange}
                value={answer}
                className={classes.answers}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton aria-label="delete" onClick={() => handleDeleteAnswer(code)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >Enregistrer</Button>
      </form>
    </Container>
  );
}

export default Interview;