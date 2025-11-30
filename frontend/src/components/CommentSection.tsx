import { useState, useEffect } from 'react';
import { IconMessage, IconSend } from '@tabler/icons-react';
import { addComment, getComments } from '../utils/api';
import { ensureUserName } from '../utils/storage';
import type { Comment } from '../types';

interface Props {
  pageId: string;
}

export function CommentSection({ pageId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [pageId]);

  const loadComments = async () => {
    try {
      const data = await getComments(pageId);
      setComments(data.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim().length < 3) {
      alert('Please write a longer comment (at least 3 characters)');
      return;
    }

    const userName = ensureUserName();
    setLoading(true);

    try {
      const data = await addComment(pageId, userName, newComment);
      setComments([data.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="glass-card rounded-xl p-6 mt-8 border-2 border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <IconMessage className="h-6 w-6 text-quantum-600" />
        <h3 className="text-xl font-display font-semibold">
          Discussion & Questions
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ask a question or share your thoughts..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-quantum-500 focus:ring-2 focus:ring-quantum-200 outline-none transition-all resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={loading || newComment.trim().length < 3}
            className="flex items-center space-x-2 quantum-gradient text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            <IconSend className="h-4 w-4" />
            <span>{loading ? 'Posting...' : 'Post Comment'}</span>
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-quantum-700">{comment.userName}</span>
                <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
              </div>
              <p className="text-gray-700">{comment.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
