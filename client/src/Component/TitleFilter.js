import React, { Component } from 'react';
import axios from 'axios';
import './style.css';

class TitleFilter extends Component{
    constructor(){
        super();
        this.state={
            titles:[],
            text:'',
            finals:[]
        }
        this.onclickbtn = this.onclickbtn.bind(this);
        this.onchange = this.onchange.bind(this);
    }
    onclickbtn(e){
        e.preventDefault();
        alert(this.state.text);
        
        var tem=this.state.titles;
        var fina=tem.filter(name => name.title.includes(this.state.text))
        console.log(fina);
        this.setState({
            finals:fina
        })

    }
    onchange(e){
        this.setState({
            text:e.target.value
        })
    }
    componentDidMount(){
        axios.get('https://jsonplaceholder.typicode.com/posts').then(
            res=>{
                this.setState({
                    finals:res.data,
                    titles:res.data
                })
                console.log(this.state.finals);
            }
        ).catch(err=>{
            console.log(err);
        });
    }
    render(){
        return(
            <div>
                <div className='inputcomps'>
                    <form onSubmit={this.onclickbtn}>
                        <input type="text" className='inputtext' id='inputid' onChange={this.onchange}/>
                        <input type="submit" />
                    </form>

                    <div>
                        {this.state.finals.map((post) => (
                            <div>
                                <p className="titlecomp">{post.title}</p>
                                <p className="bodycomp">{post.body}</p>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default TitleFilter;
