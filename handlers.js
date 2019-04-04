const notifier = require('./slack-notifier.js');

const handleMessage = (event, userMatchRegex) => {
  const attachment = event.attachments[0];
  
  const matches = attachment.text.match(userMatchRegex);
  
  if (matches && matches.length >= 1) {
    
    const targets = matches.filter((v, i, a) => a.indexOf(v) === i); 
    
    for(var i=0; i<targets.length; i++) {
      notifier.notify(event, targets[i].replace('<','').replace('>',''), attachment.text);      
    }
  }

}

const handleBitbucketMessage = (event) => {  
  handleMessage(event, /(@[U][A-Z0-9]+)/g);
};

const handleJiraMessage = (event) => {    
  handleMessage(event, /(@[a-z][a-z.]*[a-z.])/g);
};

const handleInvisionMessage = (event) => {    
  const attachment = event.attachments[0];
  console.log(event.text);
  const matches = attachment.text.match(/(@[A-Za-z]+)/g);

  if (matches && matches.length >= 1) {
  
    const targets = matches
      .map(m => m.split(/(?=[A-Z])/).join('.').replace('@.', '@').toLowerCase())
      .filter((v, i, a) => a.indexOf(v) === i); 
    
    for(var i=0; i<targets.length; i++) {
      notifier.notify(event, targets[i], attachment.text);      
    }
  }

};

module.exports = {
  handleBitbucketMessage,
  handleJiraMessage,
  handleConfluenceMessage: handleBitbucketMessage,
  handleInvisionMessage
}