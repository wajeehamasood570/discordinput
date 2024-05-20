"use client"; // This is a client component 👈🏽

import { useState, useRef, useEffect } from 'react';
import styles from './MessageInput.module.css';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(''); // State to store the file object
    const [filePreviewUrl, setFilePreviewUrl] = useState(''); // State to store the file preview URL
    const [showPicker, setShowPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const fileInputRef = useRef(null);
    const [data, setData] = useState({
        channels: ["ChannelOne", "ChannelTwo", "Channel_Three", "ChannelFour", "ChannelFive"],
        usernames: ["UserOne", "UserTwo", "UserThree", "_UserFour", "UserFive"]
    });


    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };



    const handleAttachment = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("File selected:", file);
            setFile(file);
            setFilePreviewUrl(URL.createObjectURL(file)); // Create a URL for the file
            // setMessage(filePreviewUrl);
        }
    };

    const toggleEmojiPicker = () => {
        setShowPicker(prevShowPicker => !prevShowPicker);
    };

    const onEmojiClick = (emojiObject, event) => {
        if (emojiObject) {
            setMessage(prevMessage => prevMessage + emojiObject.emoji);
        } else {
            console.error('Received incorrect emoji data:', emojiObject);
        }
    };

    useEffect(() => {
        console.log("Emoji Picker Mounted");
        return () => {
            console.log("Emoji Picker Unmounted");
            // Clean up the URL to avoid memory leaks
            if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        };
    }, [filePreviewUrl]);



    const toggleGifPicker = () => {
        setShowGifPicker(!showGifPicker);
    };

    const addGifToMessage = (gif) => {
        // Check if the gif object has the expected preview and url property
        if (!gif || !gif.preview || !gif.preview.url) {
            console.error('Invalid GIF data:', gif);
            return;  // Exit the function if the data isn't as expected
        }

        // Construct the HTML for the GIF image using the preview URL
        const imgTag = `<img src="${gif.preview.url}" alt="${gif.description || 'GIF'}" style="width: 100px; height: auto;" />`;
        setMessage(prevMessage => `${prevMessage} ${imgTag}`);
        setShowGifPicker(false);
        console.log("GIF added with preview URL:", gif.preview.url);
    };



    const renderSuggestions = () => {
        // Regex to match both @ for users and # for channels
        const mentionRegex = /([@#])(\w*)$/;
        const match = message.match(mentionRegex);
        if (!match) return null;
    
        const trigger = match[1];  // '@' or '#'
        const prefix = match[2];
        let suggestions = [];
    
        if (trigger === '@') {
            suggestions = data.usernames.filter(name => name.toLowerCase());
        } else if (trigger === '#') {
            suggestions = data.channels.filter(name => name.toLowerCase());
        }
    
        if (suggestions.length === 0) return null;
    
        return (
            <ul className={styles.mentionPicker}>
                <h5 style={{ color: "grey", padding: "12px" }}>
                    {trigger === '@' ? "Members" : "Channels"}
                </h5>
                {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => completeMention(suggestion, trigger)}>
                        {suggestion}
                    </li>
                ))}
            </ul>
        );
    };
    


    const completeMention = (suggestion, trigger) => {
        const mentionRegex = /([@#])(\w*)$/;
        setMessage(message.replace(mentionRegex, `${trigger}${suggestion} `));
    };
    

    const handleSend = () => {
        console.log("Message sent:", message);
        setMessage('');
        setFile('');
        setFilePreviewUrl('');
        setShowPicker(false); // Hide emoji picker on send
        fileInputRef.current.value = null;

    };




    return (
        <div className={styles.inputContainer}>
            <button className={styles.iconButton} onClick={handleAttachment}>+</button>
            {file && (
                <div className={styles.filePreview}>
                    <img src={filePreviewUrl} alt="Preview" style={{ width: '50px', height: 'auto' }} />
                    {/* <span className={styles.fileName}>{file.name}</span> */}
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <input
                className={styles.inputField}
                type="text"
                placeholder="Message"
                value={message}
                onChange={handleInputChange}

            />

            {renderSuggestions()}



            <button className={styles.iconButton} onClick={toggleGifPicker}>GIF</button>
            {showGifPicker && (
                <div className={styles.gifPicker}>
                    <GifPicker
                        tenorApiKey={"AIzaSyDWyW73HF2dgDeCAnrQdVi2070pHkWDXwg"}
                        onGifClick={addGifToMessage} />
                </div>
            )}


            {/* Display the message content within a content-editable div
            <div
                contentEditable={true}
                className={styles.inputField}
                dangerouslySetInnerHTML={{ __html: message }}
                onInput={(e) => setMessage(e.currentTarget.textContent)}
            ></div> */}

            <button className={styles.iconButton} onClick={toggleEmojiPicker}>😊</button>
            {showPicker && (
                <div className={styles.emojiPicker}>
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
            )}
            <button className={styles.sendButton} onClick={handleSend}>Send</button>
        </div>
    );
};

export default MessageInput;