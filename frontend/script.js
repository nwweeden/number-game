const url = 'http://localhost:3000/numbers';

let timer;
let countingUp = true;
let difficulty = 300

let currentNums = new Set();
let picked = new Set();

function startCounter(){
	timer = setInterval(count, difficulty);
}

function count(evt){
	let currentTime = +$('.counter').html();
	if (currentTime === 30 || currentTime === 0) countingUp = !countingUp;
	if (countingUp) $('.counter').html(+currentTime + 1);
	else $('.counter').html(+currentTime - 1);
}

function stopTimer(){
	clearInterval(timer)
	timer;
}

function changeDifficulty(evt){
	stopTimer()
	let speed = evt.target.innerHTML;
	if (speed === 'Easy') difficulty = 500;
	else if (speed === 'Medium') difficulty = 250;
	else if (speed === 'Insane!') difficulty = 100;
	startCounter()
}

function setupBoard(evt){
	evt.preventDefault();
	const columns = $('#columns').val();
	const rows = $('#rows').val();
	let board = $('<table>');
	for (let i=0; i<rows; i++){
		let newRow = $('<tr>');
		for (let j=0; j<columns; j++){
			const randomNum = Math.ceil(Math.random()*30)
			currentNums.add(randomNum);
			newRow.append($('<td>').html(randomNum).addClass(`${randomNum}`));
		}
		board.append(newRow);
	}
	$('.playing-board').append(board);
	$('.board-form').hide();
	$('.game').show();
	startCounter();
}

async function checkGuess(){
	let attempt = +$('.counter').html();
	if (currentNums.has(+attempt)){
		const params = {number: attempt};
		const result = await axios({
			url,
			params
		})
		changeBoard(attempt, result.data);
		picked.add(+attempt);
		if (picked.size === currentNums.size){
			handleWin();
		}
	} else{
		$('.answer').html('Incorrect')
		setTimeout(function(){ $('.answer').html(''); }, 1000);
	}
}

function handleWin(){
	$('.winner').show();
	stopTimer();
}

function changeBoard(point, fact){
	$('.answer').html('Correct!')
	setTimeout(function(){ $('.answer').html(''); }, 1000);
	$(`.${point}`).html(fact);
}

function startOver(){
	$('.winner').hide();
	$('.board-form').show();
	$('.game').hide();
	$('.playing-board').empty();
	stopTimer();
	currentNums = new Set();
	picked = new Set();
}

$('#difficulty').click(changeDifficulty)
$('.counter').click(checkGuess);
$('.start-over').click(startOver);
$('.board-form').submit(setupBoard);

