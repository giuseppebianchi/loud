define(function(require) {

	var Backbone = require("backbone");
	var UserModel = require("models/UserModel");
	
	var FollowingCollection = Backbone.Collection.extend({
		constructorName: "FollowingCollection",
		model: UserModel,
		initialize: function(options){
			this.total = options.total;
			//if all is true enable limit = 15 and url with linked partitioning = 1
			if(options.all){
				this.all = true;
				this.user_id = options.user_id;
			}
		},
		user_id: "following",
		limit: 20,
		next: null,
		all: false,
		pagination: false,
		url: function(){
			
			if(this.all){
				if(this.pagination){
					return this.next;
				}else{
					return 'http://api.soundcloud.com/me/followings?linked_partitioning=1&limit='+ this.limit + '&oauth_token=' + localStorage.getItem("accessToken");
				}
			}
			else{
				return 'http://api.soundcloud.com/me/followings?limit=5&oauth_token=' + localStorage.getItem("accessToken");
			}
				
		},
		parse: function(data){
			if(this.all){
				this.pagination = true;
				this.next = data.next_href;
				return data.collection
			}else{
				return data.collection;
			}
		}
		
    });

	return FollowingCollection;
});
