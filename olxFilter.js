const cheerio = require('cheerio');
const curl = require('curlrequest');

function olxFilter(opt){
	this.getOffers = function(){
		self.tmpList = [];
		self.counter = 0;

		for(let i = 1; i <= self.pages; i++){
			let u = self.link.split(', ');
			for(let j in u){
				self.getWebsite(u[j]+'&page='+i, self.parse);
				self.counter++;
			}
		}
	}

	this.parse = function(body){

		const $ = cheerio.load(body)
		let m = $('.offer');
		m.each(function(ind, el){
			let offer = $('h3 strong', el).text();
			let time = $('[data-icon="clock"]', el).parent().text().trim();
			let loc = $('[data-icon="location-filled"]', el).parent().text().trim();
			let price = $('.price strong', el).text().trim();
			let cat = $('.color-9 small', el).text().trim();
			let img = $('img', el).attr('src');
			let link = $('a.thumb', el).attr('href');
			price = price == 'Za darmo' ? 0 : parseInt(price);
			for(let c in self.tmpList){
				if(link && self.tmpList[c].link && link.split('#')[0] == self.tmpList[c].link.split('#')[0]) return;
			}
			self.tmpList.push({offer:offer, time:time, loc:loc, price:price, cat:cat, img:img, link:link});
		});

		self.counter--;
		if(!self.counter) {

			self.filterList();
		}
	}

	this.filterList = function(){

		self.list = self.tmpList.filter(function(el){
			if(self.offerTestMustHave && self.offerTestMustHave.test(el.offer.toLowerCase())) return true;
			if(self.offerTest && self.offerTest.test(el.offer.toLowerCase())) return false;
			if(self.categoryTest && self.categoryTest.test(el.cat)) return false;
			return true;
		});

		self.list = self.list.sort(function(a, b){
			let aa = a.time.split(' ');
			let bb = b.time.split(' ');
			if(aa[0] == 'dzisiaj'){
				if(aa[0] == bb[0]){
					if(aa[1] > bb[1]) return -1;
					else return 1;
				}
				else return -1;
			}
			else if(aa[0] == 'wczoraj'){
				if(bb[0] == 'dzisiaj') return 1;
				else if(bb[0] == 'wczoraj'){
					if(aa[1] > bb[1]) return -1;
					else return 1;
				}
				else return -1;
			}
			else {
				if(bb[0] == 'dzisiaj' || bb[0] == 'wczoraj') return 1;
				else if(parseInt(aa[0]) > parseInt(bb[0])) return -1;
				else return 1;
			}
		});
	}

	this.getData = function(){
		return {
			list: this.list,
	    	listLen: this.list.length,
	    	tmpLen: this.tmpList.length,
	    	name: this.name
		}
	}

	this.getWebsite = function(url, cb){
		curl.request(url, function (err, body){
			cb(body)
		});
	}

	this.list = [];
	this.tmpList = [];
	this.counter = 0
	this.pages = opt.pages || 10
	this.offerTest = opt.offerTest || false
	this.offerTestMustHave = opt.offerTestMustHave || false
	this.categoryTest = opt.categoryTest || false
	this.name = opt.name
	this.fullName = opt.fullName
	this.link = opt.link
	var self = this;
	setTimeout(function(){
		self.getOffers();
		setInterval(self.getOffers, (opt.interval || 2)*60*1000);
	}, opt.timeout*1000);
}

module.exports = olxFilter;