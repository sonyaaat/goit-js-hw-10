import './css/styles.css';
import {fetchCountries} from "./fetchCountries";
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input=document.querySelector('#search-box');
const countryList=document.querySelector(".country-list")
const countryInfo=document.querySelector(".country-info")
input.addEventListener("input", debounce(() => {onInput()},DEBOUNCE_DELAY))
function onInput()
{
    countryInfo.innerHTML="";
    countryList.innerHTML="";
    if(input.value==="")
    {
        return
    }
    fetchCountries().then((countries)=>{
       const newCountries= onFilter(countries)
       if(newCountries.length>10)
       {
        Notify.info("Too many matches found. Please enter a more specific name.");
        return
       }
       else if(newCountries.length===1)
       {
        renderFullList(newCountries)
        return
       }
       else if(newCountries.length>=2 && newCountries.length<=10)
       {
        renderNameList(newCountries);
        return
       }
       else
       {
        Notify.failure("Oops, there is no country with that name" )
       }
    });
    
}

function renderNameList(countries)
{
    const markup=countries.map((country)=>{
        return `<li><img width="50px" src="${country.flags.svg}"> ${country.name.official}<li/>`
    }).join("");
    countryInfo.innerHTML="";
    countryList.innerHTML=markup;
}
function renderFullList(countries)
{
    const markup=countries.map((country)=>{
        return `<li>
            <p><img width="50px" src="${country.flags.svg}"> ${country.name.official}</p>
            <p><b>Capital:</b>${country.capital}</p>
            <p><b>Population:</b>${country.population}</p>
            <p><b>Languages:</b>${Object.keys(country.languages)}</p>
        <li/>`
    }).join('');
    countryList.innerHTML="";
    countryInfo.innerHTML=markup;
    
}
function onFilter(countries)
{
    const filter= input.value.toLowerCase().trim();
    const filteredItems= countries.filter(country=>country.name.official.toLowerCase().includes(filter))
    return filteredItems;
}
// <p><b>Languages:</b>${country.languages.map((language)=> `<span>${language} </span>`)}</p>