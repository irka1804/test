import React from 'react'
import { useTranslation } from 'react-i18next'

import { getGenres } from '../../api'
import GenreTag from './GenreTag'


function GenresSelecting({ selectedGenres, setSelectedGenres }) {

    const { t, i18n } = useTranslation()

    const [ genres, dispatch ] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case 'changeActive': 
                    return {
                        ...state, 
                        [action.genreId]: {
                            ...state[action.genreId], 
                            active: !state[action.genreId].active,
                        }
                    }
                case 'setName':
                    return {
                        ...state,
                        [action.genreId]: {
                            ...state[action.genreId], 
                            name: action.name,
                        }
                    }
                default:
                    return state
            }
        },
        selectedGenres
    )

    React.useEffect(() => {
        getGenres(i18n.language)
        .then(
            response => {
                response.data.genres.map(
                    (g) => dispatch({ type: 'setName', genreId: g.id, name: g.name })
                )
            },
            error => {
                dispatch('error')
                console.log(error)
            }
        )
    }, [ i18n.language ])

    React.useEffect(() => setSelectedGenres(genres), [ genres ])

    const onClick = (genreId) => {
        dispatch({type: 'changeActive', genreId})
    }

    return (
        <div>
            <div>
                { t('mainPage.chooseGenres') }:
            </div>
            <div>
                { genres.length === 0 ? 'null' :
                    Object.keys(genres).map((g) => 
                        <GenreTag 
                            key={ g }
                            onClick={ (e) => { e.preventDefault(); onClick(g) }} 
                            { ...genres[g] } 
                        />
                    )
                } 
            </div>
        </div>
    )
}

export default GenresSelecting
