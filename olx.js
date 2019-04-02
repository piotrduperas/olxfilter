var express = require('express');
var app = express();

var olxFilter = require('./olxFilter.js')

app.set('view engine', 'ejs');

app.listen(8081);
console.log('8081 is the magic port');

var olx = [];

olx.push(new olxFilter({
	link: 'https://www.olx.pl/warszawa/?search%5Bfilter_float_price%3Ato%5D=10',
	name: '',
	fullName: 'Tanio',
	offerTest: /(ubran)|(ubrań)|(mebl)|(ziemi)|(gruz)|(drzwi)|(glina)|( buty)|(buty )|(wióro)|(pilśnio)|(drewno)|( szaf)|( sof)|(stół)|( stol)|(biur)|(torebk)/i,
	categoryTest: /(Rolnictwo)|(Ubrania)|(Meble)|(Moda)|(Dzieci)|(Koty)|(Psy)|(Książki)|(budowlane)|(Zwierzęta)/i
}));

olx.push(new olxFilter({
	timeout: 6,
	link: 'https://www.olx.pl/warszawa/?search%5Bfilter_float_price%3Ato%5D=0',
	name: 'zadarmo',
	fullName: 'Za darmo',
	offerTest: /(ubran)|(ubrań)|(mebl)|(ziemi)|(gruz)|(drzwi)|(glina)|( buty)|(buty )|(wióro)|(pilśnio)|(bucik)|(spodnie)|(sukienk)|( dres)|(bluz)|(legin)|(kanap)|( czap)|(drewno)|( szaf)|( sof)|(stół)|( stol)|(biur)|(torebk)/i,
	categoryTest: /(Rolnictwo)|(Ubrania)|(Meble)|(Moda)|(Dzieci)|(Koty)|(Psy)|(Opony)|(budowlane)|(Zwierzęta)/i
}))

olx.push(new olxFilter({
	interval: 5,
	timeout: 10,
	link: 'https://www.olx.pl/muzyka-edukacja/ksiazki/warszawa/q-ksi%C4%85%C5%BCki/?search%5Bfilter_float_price%3Ato%5D=10',
	pages: 3,
	name: 'ksiazki',
	fullName: 'Książki',
	categoryTest: /dzieci/i
}))

olx.push(new olxFilter({
	interval: 4,
	timeout: 20,
	link: 'https://www.olx.pl/warszawa/q-rower-g%C3%B3rski/?search%5Bfilter_float_price%3Ato%5D=500',
	pages: 3,
	name: 'rowery',
	fullName: 'Rowery',
	offerTest: /(rowero)|(roweru)|(dzieci)|(damsk)|(młodzie)|(mlodzie)|(podej)/i,
}));

olx.push(new olxFilter({
	interval: 5,
	timeout: 25,
	link: 'https://www.olx.pl/muzyka-edukacja/materialy-jezykowe/warszawa/q-niemiecki/?, https://www.olx.pl/muzyka-edukacja/ksiazki/warszawa/q-niemiecki/?',
	pages: 2,
	name: 'niemiecki',
	fullName: 'Niemiecki'
}));







for(let b in olx){
	app.get('/'+olx[b].name, function(req, res) {
		res.render('index', {
			filter: olx[b].getData(),
			list: olx
		});
	});
}