var boxes = [];
var turn = true;
var you = 0;
var comp = 0;

socket = io.connect("http://localhost:3000");

function load(){

	boxes = [];
	turn = true;
	you = 0;
	comp = 0;
	var m = 10;
	var n = 10;
	var offset = 50;

	var sx= sx = window.innerWidth/2 - (m*offset)/2,
	sy = offset*2.5;
	var html = "";
	$("#app").html(html);
	var c = 0;
	for(var j=0; j<m; j++){
		for(var i=0; i<n; i++){

			var x = sx + i * offset,
				y = sy + j * offset;

			html += `
				<div class="box" data-id="${c}" style="z-index=${i-1}; left:${x+2.5}px; top:${y+2.5}px"></div>
				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>						
				<div class="line lineh" data-line-1="${c}" data-line-2="${c-m}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				<div class="line linev" data-line-1="${c}" data-line-2="${c-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;			
			boxes.push(0);
			c++;
		}
	}

	//right boxes
	for(var i=0; i<n; i++){
		var x = sx + m * offset,
			y = sy + i * offset;
		html += `				
				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>
				<div class="line linev" data-line-1="${m*(i+1)-1}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;		
	}

	//bottom boxes
	for(var i=0; i<m; i++){
		var x = sx + i * offset,
			y = sy + n * offset;
		html += `				
				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>
				<div class="line lineh" data-line-1="${((n-1)*m)+i}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;		
	}

	//right-bottom most dot
	html += `<div class="dot" style="z-index=${i}; left:${sx+m*offset-5}px; top:${sy+n*offset-5}px" data-active="false"></div>`
	
	//append to dom
	$("#app").html(html);
	$(".turn").text("Turn : " +"Player 1");
	applyEvents();
}

function applyEvents(){
	$("div.line").unbind('click').bind('click', function(){
		socket.emit('click-line', { 'data-line-1': $(this).attr('data-line-1'), 'data-line-2': $(this).attr('data-line-2') });
		clickline($(this).attr('data-line-1'), $(this).attr('data-line-2'));
	});
}

function clickline(dataline1, dataline2) {
	var a = false, b = false;
	if(dataline1 >= 0) var a = addValue(dataline1);
	if(dataline2 >= 0) var b = addValue(dataline2);

	$('[data-line-1="' + dataline1 + '"][data-line-2="'+ dataline2 +'"]').addClass("line-active");
	$('[data-line-1="' + dataline1 + '"][data-line-2="'+ dataline2 +'"]').attr("data-active", "true");
		
	turn = !turn;	
	turn ? $(".turn").text("Turn : " +"Player 1") : $(".turn").text("Turn : " +"Player 2")		
}

function acquire(id){

	var color;
	if(turn){
		color = "salmon";
		you++;
	}else{
		color = "skyblue";
		comp++;
	}
	
	$("div.box[data-id='"+id+"']").css("background-color", color);	
	boxes[id] = "full";

	$(".player2").text("Player 2 : " + you);
	$(".player1").text("Player 1 : " + comp);

	var full = true;
	for(var i=boxes.length-1; i>=0; i--){
		if(boxes[i] != full){
			full = false;
			break;
		}
	}

	if(full) alert(((you>comp) ? "You": "Computer") + " won");
}

function addValue(id){
	boxes[id]++;

	if(boxes[id] === 4){
		acquire(id);
		return true;
	}
	return false;
}

function random(min, max){        
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

socket.on('clicked-line', (data) => {
	clickline(data['data-line-1'], data['data-line-2']);
})

load();