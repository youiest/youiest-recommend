/*** @jsx React.DOM */
userId = "nicolsondsouza";
var RecommendListReact = new React.createClass({
	getInitialState: function(){
		// var recommend = [];
		// var user = WI.findOne({
		// 	"_id": userId,
		// });
		// var imageId = Session.get("imageId");
		// if(user && user.recommend){
		// 	recommend = user.recommend;
		// }
		return {
			recommend: []
		}
	},
	componentDidMount: function(){
		var self = this;
		Tracker.autorun(function(){
			var big = Session.get("big");
			if(big && big[0]){
				recommend = Recommend.find({"imageId": big[0]._id}).fetch();
				self.setState({recommend: recommend})
			}
			// var user = WI.findOne({
			// 	"_id": userId,
			// });
			// var imageId = Session.get("imageId");
			// if(user && user.recommend){
				// self.setState({recommend: Recommend.find("imageId": Session.get("imageId"))})
			// }
		});
	},
	"onClickrecommend": function(currentrecommend){
		var recommend = this.state.recommend;
		// console.log(currentrecommend)
		for(var i=0,il=recommend.length;i<il;i++){
			if(recommend[i]._id == currentrecommend._id){
				recommend[i].active = "active";
			}
			else{
				recommend[i].active = "";	
			}
		}
		this.setState({recommend: recommend})
		// console.log(this);
		// this.setState({})
	},
	"render": function(){
		var self = this;	
		recommendlist = this.state.recommend.map(function(recommend){
			return <RecommendReact recommend={recommend} onClickrecommend={self.onClickrecommend}/>
		})
		return( 
			<div>
				{recommendlist}
			</div>
		)
		
	}
});
Recommend.RecommendListReact = RecommendListReact;

var RecommendReact = new React.createClass({
	"onClickrecommend": function(){
		this.props.onClickrecommend(this.props.recommend);
		Session.set("recommendId",this.props.recommend._id);
		// console.log(this.props.onClickrecommend)
	},
	"render": function(){
			var recommend = this.props.recommend;
			var style = {
				left: recommend.XP +"%", 
				top: recommend.YP +"%"
			}
			var className = "ui small images vote"+(this.props.recommend.active||"");
			return( 
				<img className={className} style={style} src={this.props.recommend.receiver_picture} onClick={this.onClickrecommend}/>
			)
	}
});
Recommend.RecommendReact = RecommendReact;

Template.recommendPackage.rendered = function(){
	React.renderComponent(<RecommendListReact />, document.getElementById('recommendPackage'))
}