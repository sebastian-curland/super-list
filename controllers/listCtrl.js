var mongoose = require('mongoose'),
	List = mongoose.model('list'),
	controller = {};
	

controller.loadProduct = function(req, res, next, id){
	List.findById(id, function(err, product){
		if(err) return next(err);
		if(!product) return res.sendStatus(404);
		req.product = product;
		req.id = id;
		next();
	});
}
	
controller.index = [
	function(req, res, next){
		List.find({}, function(err, products){
			if(err) return next(err);			
			res.render('index', {products:products});
		});
	}
];

controller.create = function(socket){
	return[
		function(req, res, next){
			if("name" in req.body && req.body.name !== ''){			
				req.body.status = 1;
				next();
			}else{
				res.sendStatus(400);
			}
		},
		function(req, res, next){
			
			var product = new List({
				name: req.body.name,
				quantity: 1,
				status: false			
			});
			
			List.create(product, function(err, prod){
				if(err) return next(err);
				res.sendStatus(200);
				socket.emit('newProduct', prod);
			});
		}
	];
}

controller.delete = function(socket){
	return [
		function(req, res, next){
			req.product.remove(function(err){
				if(err) return next(err);
				res.sendStatus(200);
				socket.emit('productDeleted', req.id);
			});
		}
	];
}

controller.deleteAll = function(socket){
	return [
		function(req, res, next){
			List.remove({},function(err){
				if(err) return next(err);
				res.sendStatus(200);
				socket.emit('deletedAll');
			});
		}
	];
}

controller.updateStatus = function(socket){
	return [
		function(req, res, next){
			
			req.product.status = req.body.status;
			req.product.save(function(err, prod){
				if(err) return next(err);
				res.sendStatus(200);
				socket.emit('productUpdated', prod);
			});
		}
	];
}

module.exports = controller;