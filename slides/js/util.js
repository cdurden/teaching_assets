function getFormData($form){
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function(n, i){
                    indexed_array[n['name']] = n['value'];
                });

        return indexed_array;
}
function get_slide_src(slide, collection) {
    var src = '';
    if (typeof(collection) !== 'undefined') {
        src = collection+"/"+slide;
    }
    if(slide.split('.').length === 1) {
        src = src+".html";
    }
    if (slide.split('.').pop() === "md") {
        src = src+".md";
    }
    return("./slides/"+src)
}
function update_snow_qm_task_data(data) {
  //container = document.getElementById('snow-qm_'+data.graph+"_"+data.task);
  container = $('div.snow-qm-task[source="snow-qm:'+data.collection+":"+data.task+'"]');
  console.log(data);
  console.log(container);
  $(container).find('span[class="question_view"]').html(data.html); 
  form = $(container).find('form');
  $(form).append($(document.createElement('input')).attr('name','collection').attr('type','hidden').val(data.collection));
  $(form).append($(document.createElement('input')).attr('name','task').attr('type','hidden').val(data.task));
  $(container).find('script').each(function(i,elmt) {
    var code = $(elmt).text();
    var f = new Function(code);
    f();
  });
  //$(container).find('input[name="collection"]').val(data.collection);
  //$(container).find('input[name="task"]').val(data.task);
  $(container).find('input[type="text"]').after('<span class="answer_marker"></span>');
  $(form).submit(function (e) {
    socket.emit('form_submit', data=getFormData( $(this) ));
    e.preventDefault(); // block the traditional submission of the form.
  });
}
function loadScript(url, callback)
{
    // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   // then bind the event to the callback function 
   // there are several events for cross browser compatibility
   script.onreadystatechange = callback;
   script.onload = callback;

   // fire the loading
   head.appendChild(script);
}
