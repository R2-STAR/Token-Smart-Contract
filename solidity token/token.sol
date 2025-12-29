pragma solidity ^0.8.0;

contract TokenContract {
    string public name = "RidhimaToken";   //follows ERC-20 token standard 
    string public symbol = "RID";
    uint8 public decimals = 18;          //this is how you should store float numbers onchain and never with decimal points
    uint256 public totalSupply = 1000000 * (10 ** uint256(decimals));

    mapping(address => uint256) public balanceOf;                  //mapping or object
    mapping(address => mapping(address => uint256)) public allowance;  //mapping of mapping 

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    //transfer functionality
    function transfer(address _to, uint256 _value) public returns (bool success) { //value in wei
        require(balanceOf[msg.sender] >= _value, "Not enough balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) { //To approve a transfer
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //used if someone tries to transfer on your behalf if they have the right set of allowances
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from], "Not enough balance");
        require(_value <= allowance[_from][msg.sender], "Allowance exceeded");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}