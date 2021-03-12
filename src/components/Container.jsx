import React, {Component} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'


export default class Container extends Component{
    constructor(props){
        super(props)

        this.state = {
            artists: [],
            showPost: false,
        }
    }
    
    componentDidMount() {
        axios.get("http://localhost:4000/api/artists").then(res => {
            let temp = []
            res.data.forEach(el => {
                temp.push(Object.values(el))
            })
            this.setState({artists: temp})
        })
    }

    delete(value, index){
    }

    post = (event) => {
        let props = document.querySelectorAll(".postProp")

        axios.post('http://localhost:4000/api/artists', `name=${props[0].value}&imgURL=${props[1].value}&wikipedia=${props[2].value}`)
    }

    update = e => {
        let properties = document.querySelectorAll('.postProp')
        axios.put(
            `http://localhost:4000/api/writers/${properties[4].value}`,
            `first_name=${properties[0].value}&last_name=${properties[1].value}&DOB=${properties[2].value}&book=${properties[3].value}&filepath=${properties[5].value}`
          )
    }

    add = e => {
        if(this.state.showPost) this.setState({showPost: false})
        else this.setState({showPost: true})
    }
    
    render(){
        let post = ""
        let status = <FontAwesomeIcon className="icon" icon={faPlusCircle} />
        if(this.state.showPost) {
            
            post = <div className="post">
                <input type="text" placeholder="name" className="postProp"/>
                <input type="text" placeholder="img url" className="postProp"/>
                <input type="text" placeholder="wikipedia" className="postProp"/>
                <button onClick={this.post}>submit</button>
            </div>
            status = <FontAwesomeIcon className="icon" icon={faTimesCircle} />
        }

        return(
            <React.Fragment>
                <div className="container">
                    {this.state.artists.map((value, index) => 
                        <div className="artist" key={index}>
                            <img src={value[2]} alt=""/>
                            <h4>{value[1]}</h4>
                            <a href={value[3]}>wikipedia</a>
                            <div className="icons">
                                <FontAwesomeIcon className="icon" icon={faTrash} />
                                <FontAwesomeIcon className="icon" icon={faPencilAlt} />
                            </div>
                        </div>
                    )}

                    <div className="artist">
                        <div id="add" onClick={this.add}>{status}</div>
                        {post}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}