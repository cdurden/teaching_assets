function mark(data) {
    container = $('div.question[source="digraph_question:'+data.graph+":"+data.node+'"]');
    for (let field of data.question.marked_correct) {
      $(container).find("input[name='"+field+"']").next("span.answer_marker").html('<i class="fas fa-check"></i>');
    }
    for (let field of data.question.submitted) {
      $(container).find("input[name='"+field+"']").next("span.answer_marker").html('<i class="fas fa-check"></i>');
    }
    for (let field of data.question.marked_incorrect) {
      $(container).find("input[name='"+field+"']").next("span.answer_marker").html('<i class="fas fa-times"></i>');
    }
}
