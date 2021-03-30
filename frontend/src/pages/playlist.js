import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import MenuBar from "./components/menuBar";
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import BrowsingModules from "./modules/BrowsingModules"
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SnackBar from "./components/snackBar";
import Container from "./components/container";
import MediaModule from "./modules/MediaModule";

function Playlist(props) {

    const params = useParams();
    const playlistID = params.id;
    const [playlist, setPlaylist] = useState();
    const [playlistTitle, setPlaylistTitle] = useState("");
    const [movieListState, setMovieListState] = useState([]);

    var movieList = [];

    const history = useHistory();

    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });
    const classes = useStyles();

    useEffect(() => {   //init loading
        if (playlistID != null && !playlist) {
            BrowsingModules.getPlaylist(playlistID).then((doc) => {
                if (doc.exists) {
                    setPlaylistTitle(doc.data().title);
                    setPlaylist(doc.data().movieID);
                } else {
                    console.log("doc not exist");
                }
            });
        }

        //get movie title
        if (playlist) {
            var formattedPlaylist = [];

            for (var i in playlist) {
                formattedPlaylist.push(parseInt(playlist[i]))
            }

            MediaModule.getMovieInfos(formattedPlaylist).then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("empty");
                } else {
                    querySnapshot.forEach((doc) => {
                        movieList.push(doc.data());
                        setMovieListState([...movieList]);
                    });
                }
            }).catch((e) => {
                console.log(e.message);
            });
        }
    }, [playlist]);

    const PlaylistTable = () => {
        const WatchButton = (props) => {

            const Container = styled.div`
                display: inline;
                margin: 5px;
            `;

            const onclickHandler = () => {
                const id = props.id;
                history.push("/movie/" + id);
            }

            return (
                <Container>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onclickHandler}
                    >
                        Watch
                    </Button>
                </Container>

            );
        };

        const RemoveButton = (props) => {

            const Container = styled.div`
                display: inline;
                margin: 5px;
            `;

            const onclickHandler = () => {
                const movieID = props.id;
                const list = playlist;
                console.log(list, movieID);
                for (var i in list) {
                    if (list[i] == movieID) {
                        list.splice(i, 1);
                        BrowsingModules.updatePlaylist(playlistID, list).then(() => {
                            window.location.reload();   //reload page
                        });
                        break;
                    }
                }
            }

            return (
                <Container>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onclickHandler}
                    >
                        Remove
                    </Button>
                </Container>
            );
        };

        const showMovieInfo = () => {
            var res;

            if (movieListState) {
                res = movieListState.map((movie, i) => (
                    <TableRow key={movie.title}>
                        <TableCell component="th" scope="row">
                            {movie.title}
                        </TableCell>
                        <TableCell align="right">
                            <WatchButton id={movie.id} />
                            <RemoveButton id={movie.id} />
                        </TableCell>
                    </TableRow>
                ));
            }

            return res;
        }

        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Movie Title</b></TableCell>
                            <TableCell align="right"><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {showMovieInfo()}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }


    return (
        <Container>
            <SnackBar show={() => { if (playlistID) { return false; } else { return true; } }}>No Playlist ID in URL.</SnackBar>
            <MenuBar />
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <h2>{playlistTitle}</h2>
                </Grid>
                <Grid item xs={12}>
                    <PlaylistTable />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Playlist;