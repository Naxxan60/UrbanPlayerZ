import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
  
const PokemonList: FunctionComponent = () => {
  
  return (
    <div>
      <h1 className="center">Pokédex</h1>
      <Link to="/profil">go profil</Link>
    </div> 
  );
}
  
export default PokemonList;